// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title TokenSwapERC7984
 * @notice Swap two confidential tokens with hidden amounts
 */
contract TokenSwapERC7984 is ZamaEthereumConfig {
    mapping(address => euint32) private _balancesTokenA;
    mapping(address => euint32) private _balancesTokenB;
    
    event Swap(address indexed user);
    
    function depositTokenA(externalEuint32 inputAmount, bytes calldata proof) external {
        euint32 amount = FHE.fromExternal(inputAmount, proof);
        _balancesTokenA[msg.sender] = FHE.add(_balancesTokenA[msg.sender], amount);
        FHE.allowThis(_balancesTokenA[msg.sender]);
        FHE.allow(_balancesTokenA[msg.sender], msg.sender);
    }
    
    function swapAforB(externalEuint32 inputAmount, bytes calldata proof) external {
        euint32 amount = FHE.fromExternal(inputAmount, proof);
        
        _balancesTokenA[msg.sender] = FHE.sub(_balancesTokenA[msg.sender], amount);
        FHE.allowThis(_balancesTokenA[msg.sender]);
        FHE.allow(_balancesTokenA[msg.sender], msg.sender);
        
        _balancesTokenB[msg.sender] = FHE.add(_balancesTokenB[msg.sender], amount);
        FHE.allowThis(_balancesTokenB[msg.sender]);
        FHE.allow(_balancesTokenB[msg.sender], msg.sender);
        
        emit Swap(msg.sender);
    }
    
    function getBalanceTokenA() external view returns (euint32) {
        return _balancesTokenA[msg.sender];
    }
    
    function getBalanceTokenB() external view returns (euint32) {
        return _balancesTokenB[msg.sender];
    }
}
