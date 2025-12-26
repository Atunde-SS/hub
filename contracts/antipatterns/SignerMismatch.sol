// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title SignerMismatch - Input Proof Signer Errors
/// @notice Shows why encryption signer must match tx sender
contract SignerMismatch is ZamaEthereumConfig {
    euint32 private _value;
    
    event ValueStored(address indexed user);
    
    /// @notice Store value (will fail if signer mismatch)
    /// @dev Input proof validates that msg.sender == encryption signer
    function storeValue(externalEuint32 input, bytes calldata proof) external {
        // This will revert if proof was generated for different address
        _value = FHE.fromExternal(input, proof);
        
        FHE.allowThis(_value);
        FHE.allow(_value, msg.sender);
        
        emit ValueStored(msg.sender);
    }
    
    function getValue() external view returns (euint32) {
        return _value;
    }
}
