// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ConfidentialGovernor
 * @notice Private voting and governance with encrypted votes
 */
contract ConfidentialGovernor is ZamaEthereumConfig {
    struct Proposal {
        string description;
        uint256 voteEnd;
        bool executed;
        euint32 votesFor;
        euint32 votesAgainst;
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(address => euint32) private _votingPower;
    uint256 public proposalCount;
    
    event ProposalCreated(uint256 indexed id);
    event VoteCast(uint256 indexed id, address indexed voter);
    
    function setVotingPower(address voter, uint32 power) external {
        _votingPower[voter] = FHE.asEuint32(power);
        FHE.allowThis(_votingPower[voter]);
        FHE.allow(_votingPower[voter], voter);
    }
    
    function propose(string calldata description) external returns (uint256) {
        uint256 id = proposalCount++;
        Proposal storage p = proposals[id];
        p.description = description;
        p.voteEnd = block.timestamp + 3 days;
        p.votesFor = FHE.asEuint32(0);
        p.votesAgainst = FHE.asEuint32(0);
        FHE.allowThis(p.votesFor);
        FHE.allowThis(p.votesAgainst);
        emit ProposalCreated(id);
        return id;
    }
    
    function castVote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp < p.voteEnd, "Ended");
        
        euint32 power = _votingPower[msg.sender];
        if (support) {
            p.votesFor = FHE.add(p.votesFor, power);
            FHE.allowThis(p.votesFor);
        } else {
            p.votesAgainst = FHE.add(p.votesAgainst, power);
            FHE.allowThis(p.votesAgainst);
        }
        emit VoteCast(proposalId, msg.sender);
    }
}
