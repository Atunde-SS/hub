// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title PrivateTokenSwap - Confidential Token Exchange
/// @notice Swap tokens while keeping amounts private
contract PrivateTokenSwap is ZamaEthereumConfig {
    // Token balances
    mapping(address => euint32) private _balancesTokenA;
    mapping(address => euint32) private _balancesTokenB;
    
    event TokensSwapped(address indexed user);
    event Deposited(address indexed user, uint8 tokenType);
    
    /// @notice Deposit Token A
    function depositTokenA(externalEuint32 inputAmount, bytes calldata proof) external {
        euint32 amount = FHE.fromExternal(inputAmount, proof);
        _balancesTokenA[msg.sender] = FHE.add(_balancesTokenA[msg.sender], amount);
        
        FHE.allowThis(_balancesTokenA[msg.sender]);
        FHE.allow(_balancesTokenA[msg.sender], msg.sender);
        
        emit Deposited(msg.sender, 1);
    }
    
    /// @notice Deposit Token B
    function depositTokenB(externalEuint32 inputAmount, bytes calldata proof) external {
        euint32 amount = FHE.fromExternal(inputAmount, proof);
        _balancesTokenB[msg.sender] = FHE.add(_balancesTokenB[msg.sender], amount);
        
        FHE.allowThis(_balancesTokenB[msg.sender]);
        FHE.allow(_balancesTokenB[msg.sender], msg.sender);
        
        emit Deposited(msg.sender, 2);
    }
    
    /// @notice Swap Token A for Token B (1:1 ratio)
    function swapAforB(externalEuint32 inputAmount, bytes calldata proof) external {
        euint32 amount = FHE.fromExternal(inputAmount, proof);
        
        // Deduct Token A
        _balancesTokenA[msg.sender] = FHE.sub(_balancesTokenA[msg.sender], amount);
        FHE.allowThis(_balancesTokenA[msg.sender]);
        FHE.allow(_balancesTokenA[msg.sender], msg.sender);
        
        // Add Token B
        _balancesTokenB[msg.sender] = FHE.add(_balancesTokenB[msg.sender], amount);
        FHE.allowThis(_balancesTokenB[msg.sender]);
        FHE.allow(_balancesTokenB[msg.sender], msg.sender);
        
        emit TokensSwapped(msg.sender);
    }
    
    /// @notice Get balance of Token A
    function getBalanceTokenA() external view returns (euint32) {
        return _balancesTokenA[msg.sender];
    }
    
    /// @notice Get balance of Token B
    function getBalanceTokenB() external view returns (euint32) {
        return _balancesTokenB[msg.sender];
    }
}
