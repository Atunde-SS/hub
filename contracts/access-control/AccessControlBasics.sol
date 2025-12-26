// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title AccessControlBasics - Understanding FHEVM Permissions
/// @notice This contract teaches FHEVM's Access Control List (ACL) system
contract AccessControlBasics is ZamaEthereumConfig {
    /// @notice Encrypted counter accessible only with permissions
    euint32 private _counter;

    /// @notice Per-user balances
    mapping(address => euint32) private _balances;

    /// @notice Temporary values (demonstrates transient access)
    euint32 private _tempValue;

    event PermissionGranted(address indexed user, string permissionType);
    event PermissionError(string reason);

    /// @notice ✅ PATTERN 1: Both Contract and User Permissions (Most Common)
    function depositWithFullPermissions(externalEuint32 inputAmount, bytes calldata inputProof) external {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);

        // Update balance
        _balances[msg.sender] = FHE.add(_balances[msg.sender], amount);

        // Grant BOTH permissions (most common pattern)
        FHE.allowThis(_balances[msg.sender]);        // ✅ Contract can use it later
        FHE.allow(_balances[msg.sender], msg.sender); // ✅ User can decrypt it

        emit PermissionGranted(msg.sender, "Both contract and user permissions");
    }

    /// @notice ✅ PATTERN 2: Only Contract Permission
    function incrementCounterContractOnly(externalEuint32 inputValue, bytes calldata inputProof) external {
        euint32 value = FHE.fromExternal(inputValue, inputProof);

        _counter = FHE.add(_counter, value);

        // Only contract permission needed
        FHE.allowThis(_counter); // ✅ Contract can access
        // Note: User cannot decrypt counter without explicit permission

        emit PermissionGranted(address(this), "Contract-only permission");
    }

    /// @notice ✅ PATTERN 3: Grant User Permission Later
    function grantUserViewPermission() external {
        // Now grant permission to caller
        FHE.allow(_counter, msg.sender);
        emit PermissionGranted(msg.sender, "User permission granted later");
    }

    /// @notice ✅ PATTERN 4: Transient Permission (Transaction-only)
    function computeTemporaryValue(
        externalEuint32 inputA,
        externalEuint32 inputB,
        bytes calldata proofA,
        bytes calldata proofB
    ) external returns (bool) {
        euint32 a = FHE.fromExternal(inputA, proofA);
        euint32 b = FHE.fromExternal(inputB, proofB);

        // Compute temporary result
        euint32 temp = FHE.add(a, b);

        // Transient permission - only valid during THIS transaction
        FHE.allowTransient(temp, msg.sender);

        // Use temp in a comparison (simulating further computation)
        euint32 threshold = FHE.asEuint32(100);
        FHE.allowTransient(threshold, msg.sender);

        ebool isAboveThreshold = FHE.gt(temp, threshold);
        FHE.allowTransient(isAboveThreshold, msg.sender);

        // In next transaction, these handles would be invalid
        emit PermissionGranted(msg.sender, "Transient permissions used");

        return true;
    }

    /// @notice ❌ ANTI-PATTERN: Missing allowThis
    function depositWrong_MissingAllowThis(externalEuint32 inputAmount, bytes calldata inputProof) external {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);
        _balances[msg.sender] = FHE.add(_balances[msg.sender], amount);
        FHE.allow(_balances[msg.sender], msg.sender);
        emit PermissionError("Missing allowThis - contract will fail on next access");
    }

    /// @notice ❌ ANTI-PATTERN: Missing user permission
    function depositWrong_MissingUserPermission(externalEuint32 inputAmount, bytes calldata inputProof) external {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);
        _balances[msg.sender] = FHE.add(_balances[msg.sender], amount);
        FHE.allowThis(_balances[msg.sender]);
        emit PermissionError("Missing user permission - user cannot decrypt");
    }

    /// @notice ❌ ANTI-PATTERN: No permissions at all
    function depositWrong_NoPermissions(externalEuint32 inputAmount, bytes calldata inputProof) external {
        euint32 amount = FHE.fromExternal(inputAmount, inputProof);
        _balances[msg.sender] = FHE.add(_balances[msg.sender], amount);
        emit PermissionError("No permissions - value is orphaned");
    }

    /// @notice ✅ PATTERN 5: Multiple User Permissions
    function shareBalanceWith(address recipient) external {
        FHE.allow(_balances[msg.sender], recipient);
        emit PermissionGranted(recipient, "Shared access granted");
    }

    function getBalance() external view returns (euint32) {
        return _balances[msg.sender];
    }

    function getCounter() external view returns (euint32) {
        return _counter;
    }
}
