// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title ConfidentialVoting - Private Voting System
/// @notice Sealed voting where votes remain encrypted
contract ConfidentialVoting is ZamaEthereumConfig {
    enum VotingState { ACTIVE, ENDED, REVEALED }
    
    VotingState public state;
    address public admin;
    
    // Encrypted vote counts for each option
    euint32 private _votesOption1;
    euint32 private _votesOption2;
    euint32 private _votesOption3;
    
    mapping(address => bool) public hasVoted;
    uint256 public votingEndTime;
    
    event VoteCast(address indexed voter);
    event VotingEnded();
    
    constructor(uint256 durationSeconds) {
        admin = msg.sender;
        state = VotingState.ACTIVE;
        votingEndTime = block.timestamp + durationSeconds;
        
        // Initialize vote counts to zero
        _votesOption1 = FHE.asEuint32(0);
        _votesOption2 = FHE.asEuint32(0);
        _votesOption3 = FHE.asEuint32(0);
        
        FHE.allowThis(_votesOption1);
        FHE.allowThis(_votesOption2);
        FHE.allowThis(_votesOption3);
    }
    
    /// @notice Cast encrypted vote for an option
    function vote(uint8 option, externalEuint32 inputVote, bytes calldata proof) external {
        require(state == VotingState.ACTIVE, "Voting not active");
        require(block.timestamp < votingEndTime, "Voting ended");
        require(!hasVoted[msg.sender], "Already voted");
        require(option >= 1 && option <= 3, "Invalid option");
        
        euint32 voteValue = FHE.fromExternal(inputVote, proof);
        
        // Add vote to the chosen option
        if (option == 1) {
            _votesOption1 = FHE.add(_votesOption1, voteValue);
            FHE.allowThis(_votesOption1);
        } else if (option == 2) {
            _votesOption2 = FHE.add(_votesOption2, voteValue);
            FHE.allowThis(_votesOption2);
        } else {
            _votesOption3 = FHE.add(_votesOption3, voteValue);
            FHE.allowThis(_votesOption3);
        }
        
        hasVoted[msg.sender] = true;
        emit VoteCast(msg.sender);
    }
    
    /// @notice End voting
    function endVoting() external {
        require(msg.sender == admin, "Only admin");
        require(state == VotingState.ACTIVE, "Already ended");
        require(block.timestamp >= votingEndTime, "Too early");
        
        state = VotingState.ENDED;
        emit VotingEnded();
    }
    
    /// @notice Get encrypted vote count for option
    function getVotes(uint8 option) external view returns (euint32) {
        require(option >= 1 && option <= 3, "Invalid option");
        if (option == 1) return _votesOption1;
        if (option == 2) return _votesOption2;
        return _votesOption3;
    }
}
