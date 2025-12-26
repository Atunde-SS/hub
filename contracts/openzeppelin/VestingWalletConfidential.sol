// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title VestingWalletConfidential
 * @notice Time-locked token vesting with encrypted amounts
 */
contract VestingWalletConfidential is ZamaEthereumConfig {
    address public immutable beneficiary;
    uint64 public immutable start;
    uint64 public immutable duration;
    
    euint32 private _vestedAmount;
    euint32 private _releasedAmount;
    
    event TokensReleased(address indexed beneficiary);
    
    constructor(address _beneficiary, uint64 startTime, uint64 durationSec, uint32 amount) {
        beneficiary = _beneficiary;
        start = startTime;
        duration = durationSec;
        
        _vestedAmount = FHE.asEuint32(amount);
        _releasedAmount = FHE.asEuint32(0);
        FHE.allowThis(_vestedAmount);
        FHE.allowThis(_releasedAmount);
    }
    
    function release() external {
        require(msg.sender == beneficiary, "Only beneficiary");
        require(block.timestamp >= start, "Not started");
        emit TokensReleased(beneficiary);
    }
    
    function getVestedAmount() external view returns (euint32) {
        require(msg.sender == beneficiary, "Only beneficiary");
        return _vestedAmount;
    }
}
