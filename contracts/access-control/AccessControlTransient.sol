// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title AccessControlTransient - Transient Permission Management
/// @notice Learn FHE.allowTransient() for gas-efficient temporary permissions
/// @dev Transient permissions are valid ONLY for current transaction
///      Perfect for intermediate computations that don't need storage
contract AccessControlTransient is ZamaEthereumConfig {
    euint32 private _storedValue;

    event TransientOperationExecuted(address indexed user);

    /// @notice ✅ Compute with transient intermediate values
    /// @dev Shows gas-efficient pattern for temporary values
    function computeWithTransient(
        externalEuint32 inputA,
        bytes calldata proofA,
        externalEuint32 inputB,
        bytes calldata proofB
    ) external returns (bool) {
        // Convert inputs (these need permissions briefly)
        euint32 a = FHE.fromExternal(inputA, proofA);
        euint32 b = FHE.fromExternal(inputB, proofB);

        // Transient permissions - valid only in THIS transaction
        FHE.allowTransient(a, msg.sender);
        FHE.allowTransient(b, msg.sender);

        // Perform intermediate computation
        euint32 sum = FHE.add(a, b);
        FHE.allowTransient(sum, msg.sender); // Also transient

        euint32 product = FHE.mul(a, b);
        FHE.allowTransient(product, msg.sender); // Also transient

        // Compare results
        ebool sumIsGreater = FHE.gt(sum, product);
        FHE.allowTransient(sumIsGreater, msg.sender); // Also transient

        // Store final result with persistent permissions
        // _storedValue = FHE.select(sumIsGreater, sum, product);
        // FHE.allowThis(_storedValue); // Persistent!
        // FHE.allow(_storedValue, msg.sender); // Persistent!

        emit TransientOperationExecuted(msg.sender);

        // NOTE: After this transaction, a, b, sum, product, sumIsGreater
        // are no longer accessible - their permissions expired
        return true;
    }

    /// @notice ⚠️ DEMONSTRATION: Why transient doesn't work for storage
    /// @dev This shows what happens if you use transient for stored values
    function demonstrateTransientFailure(
        externalEuint32 input,
        bytes calldata proof
    ) external {
        euint32 value = FHE.fromExternal(input, proof);

        // ❌ WRONG: Using transient for stored value
        _storedValue = value;
        FHE.allowTransient(_storedValue, msg.sender);
        // Missing: FHE.allowThis(_storedValue);

        // PROBLEM: Next transaction trying to read _storedValue will fail!
        // The permission expired after this transaction
    }

    /// @notice ✅ Correct: Use persistent permissions for storage
    function storeWithPersistent(
        externalEuint32 input,
        bytes calldata proof
    ) external {
        euint32 value = FHE.fromExternal(input, proof);

        _storedValue = value;
        // ✅ CORRECT: Persistent permissions for stored value
        FHE.allowThis(_storedValue);
        FHE.allow(_storedValue, msg.sender);
    }

    /// @notice Get stored value
    function getStoredValue() external view returns (euint32) {
        return _storedValue;
    }

    /// @notice 📚 Educational: When to use transient
    function explainTransientUsage() external pure returns (string memory) {
        return
            "FHE.allowTransient() Usage Guide:\n\n"
            "GOOD Use Cases:\n"
            "1. Intermediate computations\n"
            "   - Temporary results not stored\n"
            "   - Only used in current transaction\n"
            "2. Gas optimization\n"
            "   - Cheaper than persistent permissions\n"
            "   - Automatic cleanup\n"
            "3. Validation checks\n"
            "   - Temporary boolean results\n"
            "   - Not needed after transaction\n\n"
            "BAD Use Cases:\n"
            "1. State variables\n"
            "   - Will fail in next transaction\n"
            "2. Return values\n"
            "   - Caller won't have access\n"
            "3. Anything needing persistence\n\n"
            "Gas Savings:\n"
            "- Transient: ~10-20% cheaper\n"
            "- Use for temporary values only\n"
            "- Always use persistent for storage";
    }
}
