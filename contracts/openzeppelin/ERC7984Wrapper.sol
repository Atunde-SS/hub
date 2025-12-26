// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

interface IERC20 {
    function transferFrom(address from, address  to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

/**
 * @title ERC7984Wrapper
 * @notice Wrap standard ERC20 tokens into confidential balances
 */
contract ERC7984Wrapper is ZamaEthereumConfig {
    IERC20 public immutable underlyingToken;
    mapping(address => euint32) private _encryptedBalances;
    
    event Wrapped(address indexed user, uint256 amount);
    event Unwrapped(address indexed user);
    
    constructor(address _token) {
        underlyingToken = IERC20(_token);
    }
    
    function wrap(uint32 amount) external {
        require(underlyingToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        euint32 encryptedAmount = FHE.asEuint32(amount);
        _encryptedBalances[msg.sender] = FHE.add(_encryptedBalances[msg.sender], encryptedAmount);
        
        FHE.allowThis(_encryptedBalances[msg.sender]);
        FHE.allow(_encryptedBalances[msg.sender], msg.sender);
        
        emit Wrapped(msg.sender, amount);
    }
    
    function encryptedBalanceOf(address account) external view returns (euint32) {
        return _encryptedBalances[account];
    }
}
