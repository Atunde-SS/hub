// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title HandleReuseErrors - Handle Lifecycle Management
/// @notice Learn proper encrypted value lifecycle
contract HandleReuseErrors is ZamaEthereumConfig {
    euint32 private _stored;
    euint32 private _temporary;
    
    /// @notice ✅ CORRECT: Proper handle storage
    function storeHandle(externalEuint32 input, bytes calldata proof) external {
        _stored = FHE.fromExternal(input, proof);
        FHE.allowThis(_stored);
        FHE.allow(_stored, msg.sender);
    }
    
    /// @notice ✅ CORRECT: Create new handle from operation
    function addToStored(externalEuint32 input, bytes calldata proof) external {
        euint32 value = FHE.fromExternal(input, proof);
        
        // Create NEW handle
        _stored = FHE.add(_stored, value);
        
        // Grant permissions to NEW handle
        FHE.allowThis(_stored);
        FHE.allow(_stored, msg.sender);
    }
    
    function getStored() external view returns (euint32) {
        return _stored;
    }
}
