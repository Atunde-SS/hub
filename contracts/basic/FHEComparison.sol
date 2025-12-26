// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title FHEComparison - Encrypted Comparison Operations
/// @notice Learn how to compare encrypted values
/// @dev Demonstrates FHE.eq, FHE.ne, FHE.gt, FHE.lt, FHE.ge, FHE.le
contract FHEComparison is ZamaEthereumConfig {
    euint32 private _valueA;
    euint32 private _valueB;
    ebool private _comparisonResult;

    event ComparisonPerformed(address indexed user, string operation);

    /// @notice Store two values for comparison
    function setValues(
        externalEuint32 inputA,
        bytes calldata proofA,
        externalEuint32 inputB,
        bytes calldata proofB
    ) external {
        _valueA = FHE.fromExternal(inputA, proofA);
        _valueB = FHE.fromExternal(inputB, proofB);

        FHE.allowThis(_valueA);
        FHE.allowThis(_valueB);
        FHE.allow(_valueA, msg.sender);
        FHE.allow(_valueB, msg.sender);
    }

    /// @notice Check if A equals B
    function checkEqual() external {
        _comparisonResult = FHE.eq(_valueA, _valueB);
        FHE.allowThis(_comparisonResult);
        FHE.allow(_comparisonResult, msg.sender);
        emit ComparisonPerformed(msg.sender, "equal");
    }

    /// @notice Check if A not equals B
    function checkNotEqual() external {
        _comparisonResult = FHE.ne(_valueA, _valueB);
        FHE.allowThis(_comparisonResult);
        FHE.allow(_comparisonResult, msg.sender);
        emit ComparisonPerformed(msg.sender, "not equal");
    }

    /// @notice Check if A greater than B
    function checkGreaterThan() external {
        _comparisonResult = FHE.gt(_valueA, _valueB);
        FHE.allowThis(_comparisonResult);
        FHE.allow(_comparisonResult, msg.sender);
        emit ComparisonPerformed(msg.sender, "greater than");
    }

    /// @notice Check if A less than B
    function checkLessThan() external {
        _comparisonResult = FHE.lt(_valueA, _valueB);
        FHE.allowThis(_comparisonResult);
        FHE.allow(_comparisonResult, msg.sender);
        emit ComparisonPerformed(msg.sender, "less than");
    }

    /// @notice Check if A greater than or equal to B
    function checkGreaterOrEqual() external {
        _comparisonResult = FHE.ge(_valueA, _valueB);
        FHE.allowThis(_comparisonResult);
        FHE.allow(_comparisonResult, msg.sender);
        emit ComparisonPerformed(msg.sender, "greater or equal");
    }

    /// @notice Check if A less than or equal to B
    function checkLessOrEqual() external {
        _comparisonResult = FHE.le(_valueA, _valueB);
        FHE.allowThis(_comparisonResult);
        FHE.allow(_comparisonResult, msg.sender);
        emit ComparisonPerformed(msg.sender, "less or equal");
    }

    /// @notice Get comparison result
    function getComparisonResult() external view returns (ebool) {
        return _comparisonResult;
    }

    function getValueA() external view returns (euint32) {
        return _valueA;
    }

    function getValueB() external view returns (euint32) {
        return _valueB;
    }
}
