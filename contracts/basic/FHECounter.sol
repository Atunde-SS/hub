// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHECounter - A Simple Encrypted Counter
/// @notice This contract demonstrates the basics of FHEVM by implementing an encrypted counter
/// @dev This example shows:
///      - How to use encrypted types (euint32)
///      - How to accept encrypted inputs with input proofs
///      - How to perform FHE operations (add, sub)
///      - How to properly manage access control permissions
contract FHECounter is ZamaEthereumConfig {
    /// @notice The encrypted counter value
    /// @dev This is stored as an encrypted uint32 (euint32)
    ///      Only authorized parties can decrypt this value
    euint32 private _count;

    /// @notice Event emitted when counter is incremented
    /// @param user The address that incremented the counter
    event Incremented(address indexed user);

    /// @notice Event emitted when counter is decremented
    /// @param user The address that decremented the counter
    event Decremented(address indexed user);

    /// @notice Returns the encrypted count value
    /// @dev The returned value is a handle (bytes32) to the encrypted value
    ///      Users need proper permissions to decrypt this value
    /// @return The encrypted counter handle
    function getCount() external view returns (euint32) {
        return _count;
    }

    /// @notice Increments the counter by an encrypted value
    /// @dev This demonstrates the complete FHEVM workflow:
    ///      1. Accept encrypted input with proof
    ///      2. Verify and convert the input
    ///      3. Perform FHE operation (addition)
    ///      4. Grant permissions for future access
    /// @param inputEuint32 The encrypted value to add (as external handle)
    /// @param inputProof The zero-knowledge proof validating the encryption
    function increment(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        // Convert external encrypted input to internal format
        // This verifies the input proof and binds the value to this contract
        euint32 encryptedValue = FHE.fromExternal(inputEuint32, inputProof);

        // Perform encrypted addition
        // This happens entirely on encrypted data - no decryption!
        _count = FHE.add(_count, encryptedValue);

        // CRITICAL: Grant permissions for the new encrypted value
        // Without these, the contract and user can't access the value later
        FHE.allowThis(_count);        // Allow this contract to use the value
        FHE.allow(_count, msg.sender); // Allow the user to decrypt the value

        emit Incremented(msg.sender);
    }

    /// @notice Decrements the counter by an encrypted value
    /// @dev Similar to increment, but using FHE.sub instead of FHE.add
    ///      Note: This doesn't check for underflow - see anti-patterns examples
    /// @param inputEuint32 The encrypted value to subtract
    /// @param inputProof The zero-knowledge proof validating the encryption
    function decrement(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        euint32 encryptedValue = FHE.fromExternal(inputEuint32, inputProof);

        // Perform encrypted subtraction
        _count = FHE.sub(_count, encryptedValue);

        // Always remember to grant permissions!
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);

        emit Decremented(msg.sender);
    }

    /// @notice Resets the counter to an encrypted value
    /// @dev Useful for testing or resetting state
    /// @param inputEuint32 The new encrypted counter value
    /// @param inputProof The zero-knowledge proof validating the encryption
    function reset(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        _count = FHE.fromExternal(inputEuint32, inputProof);
        FHE.allowThis(_count);
        FHE.allow(_count, msg.sender);
    }
}
