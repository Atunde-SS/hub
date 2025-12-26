// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title ViewFunctionAntipattern - Why You Cannot Use Encrypted Values in View Functions
/// @notice This contract demonstrates a critical FHEVM limitation
/// @dev 🚫 CRITICAL ANTI-PATTERN:
///      You CANNOT perform FHE operations in view/pure functions!
///
/// 🎓 **Why This Limitation Exists:**
///    - FHE operations require interaction with FHEVM coprocessor
///    - Coprocessor operations modify state (grant permissions, compute)
///    - View functions cannot modify state by definition
///    - Therefore: FHE operations incompatible with view functions
///
/// ⚠️ **Common Mistakes:**
///    1. Trying to decrypt in view function
///    2. Performing FHE.add/sub/etc in view function
///    3. Using FHE.gt/eq for view-based access control
///    4. Returning decrypted values from view functions
///
/// ✅ **What You CAN Do:**
///    - Return encrypted HANDLES (euint32) from view functions
///    - Client-side decryption using the handle
///    - Store pre-computed results for view access
///    - Use public decryption for revealing values
contract ViewFunctionAntipattern is ZamaEthereumConfig {
    euint32 private _valueA;
    euint32 private _valueB;
    euint32 private _precomputedSum; // Pre-computed for view access

    /// @notice Store two encrypted values
    function setValues(
        externalEuint32 inputA,
        externalEuint32 inputB,
        bytes calldata proofA,
        bytes calldata proofB
    ) external {
        _valueA = FHE.fromExternal(inputA, proofA);
        _valueB = FHE.fromExternal(inputB, proofB);

        // Pre-compute sum for later view access
        _precomputedSum = FHE.add(_valueA, _valueB);

        // Grant permissions
        FHE.allowThis(_valueA);
        FHE.allowThis(_valueB);
        FHE.allowThis(_precomputedSum);
        FHE.allow(_valueA, msg.sender);
        FHE.allow(_valueB, msg.sender);
        FHE.allow(_precomputedSum, msg.sender);
    }

    /// @notice ✅ CORRECT: Return encrypted handle from view function
    /// @dev This is allowed - we're just reading a handle, not performing FHE ops
    /// @return The encrypted value handle (client can decrypt)
    function getValueA() external view returns (euint32) {
        return _valueA;
    }

    /// @notice ✅ CORRECT: Return pre-computed encrypted result
    /// @dev The FHE operation was done in setValues(), here we just return handle
    function getPrecomputedSum() external view returns (euint32) {
        return _precomputedSum;
    }

    /// @notice ❌ WRONG: Cannot perform FHE operations in view function
    /// @dev This will NOT compile or will revert at runtime
    /// @return Would return sum, but CANNOT be view
    // Commented out because it won't compile:
    /*
    function computeSumInView() external view returns (euint32) {
        // ❌ ERROR: Cannot call FHE.add in view function
        // FHE operations modify state (permissions, coprocessor calls)
        return FHE.add(_valueA, _valueB);
    }
    */

    /// @notice ✅ CORRECT: Compute sum in non-view function
    /// @dev This works - it's a state-changing transaction
    function computeSumCorrect() external returns (euint32) {
        euint32 sum = FHE.add(_valueA, _valueB);
        FHE.allowThis(sum);
        FHE.allow(sum, msg.sender);
        return sum;
    }

    /// @notice ❌ WRONG: Cannot decrypt in view function
    /// @dev Decryption requires relayer interaction, not possible in view
    // This pattern is fundamentally impossible:
    /*
    function getDecryptedValueWrong() external view returns (uint32) {
        // ❌ ERROR: No way to decrypt in view function
        // Decryption requires:
        // 1. Request to relayer (state change)
        // 2. Callback with result (another transaction)
        // return decryptValue(_valueA); // No such function exists in view context
    }
    */

    /// @notice ❌ WRONG: Cannot use FHE comparison for access control in view
    /// @dev Attempting to use encrypted comparison in view context
    // This won't work:
    /*
    function hasHighValue() external view returns (bool) {
        euint32 threshold = FHE.asEuint32(100);
        ebool isHigh = FHE.gt(_valueA, threshold); // ❌ Cannot do in view
        // Even if we could, we can't decrypt the boolean result in view
        return false; // Placeholder - this pattern is impossible
    }
    */

    /// @notice ✅ CORRECT: Pre-compute boolean for view access
    /// @dev Compute in state-changing function, store result, read in view
    ebool private _isHighValue;
    bool private _isHighValueDecrypted;

    function computeIsHighValue() external {
        euint32 threshold = FHE.asEuint32(100);
        _isHighValue = FHE.gt(_valueA, threshold);
        FHE.allowThis(_isHighValue);
        
        // In production, trigger public decryption here
        // For demo, we'll simulate with a flag
    }

    function getIsHighValueHandle() external view returns (ebool) {
        // ✅ CORRECT: Return encrypted boolean handle
        return _isHighValue;
    }

    /// @notice 📚 WORKAROUND 1: Pre-compute in state-changing function
    /// @dev This is the recommended pattern
    function demonstratePrecomputePattern() external pure returns (string memory) {
        return
            "WORKAROUND 1: Pre-compute Pattern\n\n"
            "Problem: Need to access FHE computation result in view function\n"
            "Solution: Compute in state-changing function, read handle in view\n\n"
            "Example:\n"
            "// State-changing function\n"
            "function computeSum() external {\n"
            "    _sum = FHE.add(_a, _b);\n"
            "    FHE.allowThis(_sum);\n"
            "}\n\n"
            "// View function\n"
            "function getSum() external view returns (euint32) {\n"
            "    return _sum; // Just return handle\n"
            "}\n\n"
            "// Client-side\n"
            "const encryptedSum = await contract.getSum();\n"
            "const decryptedSum = await fhevm.decrypt(encryptedSum);";
    }

    /// @notice 📚 WORKAROUND 2: Client-side operations
    /// @dev Perform operations client-side using retrieved handles
    function demonstrateClientSidePattern() external pure returns (string memory) {
        return
            "WORKAROUND 2: Client-Side Operations\n\n"
            "Problem: Need to perform FHE operations for view-like access\n"
            "Solution: Retrieve encrypted handles, operate client-side\n\n"
            "Example:\n"
            "// Solidity - just return handles\n"
            "function getValues() external view returns (euint32, euint32) {\n"
            "    return (_valueA, _valueB);\n"
            "}\n\n"
            "// Client-side TypeScript\n"
            "const [handleA, handleB] = await contract.getValues();\n"
            "const decryptedA = await fhevm.decrypt(handleA);\n"
            "const decryptedB = await fhevm.decrypt(handleB);\n"
            "const sum = decryptedA + decryptedB; // Do math client-side\n\n"
            "Limitation: Loses privacy if you decrypt client-side";
    }

    /// @notice 📚 WORKAROUND 3: Public decryption for results
    /// @dev Use relayer for public decryption when privacy not needed
    function demonstratePublicDecryptionPattern() external pure returns (string memory) {
        return
            "WORKAROUND 3: Public Decryption Pattern\n\n"
            "Problem: Need to make result publicly viewable\n"
            "Solution: Use public decryption relayer, store plaintext\n\n"
            "Example:\n"
            "// State variables\n"
            "euint32 private _encryptedResult;\n"
            "uint32 public decryptedResult; // Public after decryption\n\n"
            "// Trigger public decryption\n"
            "function requestDecryption() external {\n"
            "    FHE.makePubliclyDecryptable(_encryptedResult);\n"
            "    // Relayer will call callback with decrypted value\n"
            "}\n\n"
            "// Callback from relayer\n"
            "function callbackResult(uint256 callbackId, uint32 value) external {\n"
            "    require(msg.sender == relayer, 'Unauthorized');\n"
            "    decryptedResult = value; // Now publicly viewable\n"
            "}\n\n"
            "// View function\n"
            "function getResult() external view returns (uint32) {\n"
            "    return decryptedResult; // Plaintext, no FHE ops needed\n"
            "}";
    }

    /// @notice 📚 EDUCATIONAL: Why this limitation exists
    function explainWhyViewDoesntWork() external pure returns (string memory) {
        return
            "Why FHE Operations Don't Work in View Functions:\n\n"
            "Technical Reasons:\n"
            "1. FHE operations require FHEVM coprocessor interaction\n"
            "2. Coprocessor calls modify state (gas accounting, permissions)\n"
            "3. View functions are read-only by Solidity definition\n"
            "4. State modification in view = contradiction\n\n"
            "Specific Operations That Don't Work:\n"
            "FHE.add/sub/mul (coprocessor compute)\n"
            "FHE.gt/lt/eq (coprocessor compare)\n"
            "FHE.select (conditional evaluation)\n"
            "FHE.asEuint (creates new ciphertext)\n"
            "FHE.allow* (modifies ACL state)\n"
            "Any decryption (requires relayer)\n\n"
            "What DOES Work:\n"
            "Returning euint/ebool handles\n"
            "Reading stored encrypted values\n"
            "Returning pre-computed results\n"
            "Basic Solidity logic (if statements on plaintext)\n\n"
            "Design Implications:\n"
            "- Compute eagerly, not lazily\n"
            "- Pre-compute values you'll need to read\n"
            "- Use client-side decryption for view-like behavior\n"
            "- Consider public decryption for truly public data";
    }

    /// @notice 📚 EDUCATIONAL: Common patterns and solutions
    function explainCommonPatterns() external pure returns (string memory) {
        return
            "Common Use Cases and Solutions:\n\n"
            "Use Case 1: Check if user's balance >= amount\n"
            "Wrong: function canAfford(uint amount) view returns (bool)\n"
            "Right: Pre-compute threshold checks, or do check in transaction\n\n"
            "Use Case 2: Get sum of two encrypted values\n"
            "Wrong: function getSum() view returns (euint32)\n"
            "Right: Compute sum in non-view, return handle in view\n\n"
            "Use Case 3: Display decrypted value on frontend\n"
            "Wrong: Try to decrypt in view function\n"
            "Right: Get handle in view, decrypt client-side with user's key\n\n"
            "Use Case 4: Public leaderboard with encrypted scores\n"
            "Wrong: Compare scores in view to sort\n"
            "Right: Use public decryption + events, or maintain plaintext leaderboard\n\n"
            "General Rule:\n"
            "If you need FHE operations, it MUST be a state-changing transaction.\n"
            "View functions can only return encrypted handles, not operate on them.";
    }
}
