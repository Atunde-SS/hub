// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title MissingPermissions - Common Permission Mistakes
/// @notice Learn from permission errors
contract MissingPermissions is ZamaEthereumConfig {
    euint32 private _value;
    
    /// @notice ❌ WRONG: Missing allowThis
    function storeValue_MissingAllowThis(externalEuint32 input, bytes calldata proof) external {
        _value = FHE.fromExternal(input, proof);
        // Missing: FHE.allowThis(_value);
        FHE.allow(_value, msg.sender);
        // PROBLEM: Contract can't access _value in next transaction!
    }
    
    /// @notice ❌ WRONG: Missing user permission
    function storeValue_MissingUserPermission(externalEuint32 input, bytes calldata proof) external {
        _value = FHE.fromExternal(input, proof);
        FHE.allowThis(_value);
        // Missing: FHE.allow(_value, msg.sender);
        // PROBLEM: User can't decrypt their value!
    }
    
    /// @notice ✅ CORRECT: Both permissions granted
    function storeValue_Correct(externalEuint32 input, bytes calldata proof) external {
        _value = FHE.fromExternal(input, proof);
        FHE.allowThis(_value);
        FHE.allow(_value, msg.sender);
    }
    
    function getValue() external view returns (euint32) {
        return _value;
    }
}
