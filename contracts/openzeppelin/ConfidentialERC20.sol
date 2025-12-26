// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title ConfidentialERC20 - Basic Confidential Token
 * @notice ERC7984-inspired confidential token with encrypted balances
 * @dev Educational example of confidential tokens using FHEVM
 */
contract ConfidentialERC20 is ZamaEthereumConfig {
    string public name = "Confidential Token";
    string public symbol = "CTKN";
    uint8 public decimals = 18;
    
    uint256 public totalSupply;
    mapping(address => euint32) private _balances;
    
    event Transfer(address indexed from, address indexed to);
    event Mint(address indexed to, uint256 amount);
    
    function mint(address to, uint32 amount) external {
        euint32 encryptedAmount = FHE.asEuint32(amount);
        _balances[to] = FHE.add(_balances[to], encryptedAmount);
        
        FHE.allowThis(_balances[to]);
        FHE.allow(_balances[to], to);
        
        totalSupply += amount;
        emit Mint(to, amount);
    }
    
    function transfer(address to, externalEuint32 inputAmount, bytes calldata proof) external returns (bool) {
        euint32 amount = FHE.fromExternal(inputAmount, proof);
        
        _balances[msg.sender] = FHE.sub(_balances[msg.sender], amount);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
        
        _balances[to] = FHE.add(_balances[to], amount);
        FHE.allowThis(_balances[to]);
        FHE.allow(_balances[to], to);
        
        emit Transfer(msg.sender, to);
        return true;
    }
    
    function balanceOf(address account) external view returns (euint32) {
        return _balances[account];
    }
}
