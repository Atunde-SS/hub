// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title PermissionPatterns - Common Permission Patterns
/// @notice Collection of real-world permission management patterns
contract PermissionPatterns is ZamaEthereumConfig {
    // User balances
    mapping(address => euint32) private _balances;

    // Shared data structure
    struct SharedData {
        euint32 value;
        address[] authorizedUsers;
    }
    mapping(uint256 => SharedData) private _sharedData;
    uint256 private _nextDataId;

    event DataShared(uint256 indexed dataId, address[] authorizedUsers);
    event PermissionGranted(address indexed to, uint256 indexed dataId);

    /// @notice ✅ PATTERN 1: User-owned balance
    function depositToBalance(
        externalEuint32 inputAmount,
        bytes calldata proof
    ) external {
        euint32 amount = FHE.fromExternal(inputAmount, proof);

        // Update balance
        _balances[msg.sender] = FHE.add(_balances[msg.sender], amount);

        // Standard pattern: both contract and user permissions
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
    }

    /// @notice ✅ PATTERN 2: Multi-user shared data
    function createSharedData(
        externalEuint32 inputValue,
        bytes calldata proof,
        address[] calldata authorizedUsers
    ) external returns (uint256) {
        euint32 value = FHE.fromExternal(inputValue, proof);

        uint256 dataId = _nextDataId++;
        _sharedData[dataId].value = value;
        _sharedData[dataId].authorizedUsers = authorizedUsers;

        // Grant contract permission
        FHE.allowThis(value);

        // Grant permission to creator
        FHE.allow(value, msg.sender);

        // Grant permission to all authorized users
        for (uint256 i = 0; i < authorizedUsers.length; i++) {
            FHE.allow(value, authorizedUsers[i]);
        }

        emit DataShared(dataId, authorizedUsers);
        return dataId;
    }

    /// @notice ✅ PATTERN 3: Add user to shared data later
    function grantAccessToSharedData(uint256 dataId, address newUser) external {
        require(dataId < _nextDataId, "Invalid data ID");

        // Only authorized users can grant access
        bool isAuthorized = false;
        address[] memory authorized = _sharedData[dataId].authorizedUsers;
        for (uint256 i = 0; i < authorized.length; i++) {
            if (authorized[i] == msg.sender) {
                isAuthorized = true;
                break;
            }
        }
        require(isAuthorized, "Not authorized");

        // Grant permission to new user
        FHE.allow(_sharedData[dataId].value, newUser);
        _sharedData[dataId].authorizedUsers.push(newUser);

        emit PermissionGranted(newUser, dataId);
    }

    /// @notice ✅ PATTERN 4: Transfer with permission update
    function transferBalance(address to, externalEuint32 inputAmount, bytes calldata proof) external {
        euint32 amount = FHE.fromExternal(inputAmount, proof);

        // Deduct from sender
        _balances[msg.sender] = FHE.sub(_balances[msg.sender], amount);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);

        // Add to receiver
        _balances[to] = FHE.add(_balances[to], amount);
        FHE.allowThis(_balances[to]);
        FHE.allow(_balances[to], to); // Receiver gets permission
    }

    /// @notice Get user balance
    function getBalance(address user) external view returns (euint32) {
        return _balances[user];
    }

    /// @notice Get shared data value
    function getSharedDataValue(uint256 dataId) external view returns (euint32) {
        require(dataId < _nextDataId, "Invalid data ID");
        return _sharedData[dataId].value;
    }

    /// @notice Get authorized users for shared data
    function getAuthorizedUsers(uint256 dataId) external view returns (address[] memory) {
        require(dataId < _nextDataId, "Invalid data ID");
        return _sharedData[dataId].authorizedUsers;
    }
}