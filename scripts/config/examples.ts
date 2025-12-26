
import path from 'path';

export interface ExampleConfig {
    title: string;
    description: string;
    contract: string;
    test: string;
    output: string;
    category: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const EXAMPLES_MAP: Record<string, ExampleConfig> = {
    // Basic
    'fhe-counter': {
        title: 'FHE Counter',
        description: 'This example demonstrates how to build a confidential counter using FHEVM, in comparison to a simple counter.',
        contract: 'contracts/basic/FHECounter.sol',
        test: 'test/basic/FHECounter.ts',
        output: 'docs/basic/fhe-counter.md',
        category: 'Basic',
        difficulty: 'Beginner'
    },
    'encrypt-single-value': {
        title: 'Encrypt Single Value',
        description: 'This example demonstrates the FHE encryption mechanism and highlights a common pitfall developers may encounter.',
        contract: 'contracts/basic/encrypt/EncryptSingleValue.sol',
        test: 'test/basic/encrypt/EncryptSingleValue.ts',
        output: 'docs/basic/encrypt-single-value.md',
        category: 'Basic - Encryption',
        difficulty: 'Beginner'
    },
    'encrypt-multiple-values': {
        title: 'Encrypt Multiple Values',
        description: 'This example shows how to encrypt and handle multiple values in a single transaction.',
        contract: 'contracts/basic/encrypt/EncryptMultipleValues.sol',
        test: 'test/basic/encrypt/EncryptMultipleValues.ts',
        output: 'docs/basic/encrypt-multiple-values.md',
        category: 'Basic - Encryption',
        difficulty: 'Intermediate'
    },
    'fhe-add': {
        title: 'FHE Add Operation',
        description: 'This example demonstrates how to perform addition operations on encrypted values.',
        contract: 'contracts/basic/fhe-operations/FHEAdd.sol',
        test: 'test/basic/fhe-operations/FHEAdd.ts',
        output: 'docs/basic/fhe-add.md',
        category: 'Basic - FHE Operations',
        difficulty: 'Beginner'
    },
    'fhe-comparison': {
        title: 'FHE Comparison',
        description: 'Demonstrates FHE comparison operations (gt, lt, eq, etc).',
        contract: 'contracts/basic/FHEComparison.sol',
        test: 'test/basic/fhe-operations/FHEComparison.ts',
        output: 'docs/basic/fhe-comparison.md',
        category: 'Basic - FHE Operations',
        difficulty: 'Beginner'
    },
    'fhe-if-then-else': {
        title: 'FHE If-Then-Else',
        description: 'This example shows conditional operations on encrypted values using FHE.',
        contract: 'contracts/basic/fhe-operations/FHEIfThenElse.sol',
        test: 'test/basic/fhe-operations/FHEIfThenElse.ts',
        output: 'docs/basic/fhe-if-then-else.md',
        category: 'Basic - FHE Operations',
        difficulty: 'Intermediate'
    },

    // Decryption
    'user-decrypt-single-value': {
        title: 'User Decrypt Single Value',
        description: 'Demonstrates user decryption and permission requirements.',
        contract: 'contracts/basic/decrypt/UserDecryptSingleValue.sol',
        test: 'test/basic/decrypt/UserDecryptSingleValue.ts',
        output: 'docs/decryption/user-decrypt-single-value.md',
        category: 'Decryption',
        difficulty: 'Intermediate'
    },
    'user-decrypt-multiple-values': {
        title: 'User Decrypt Multiple Values',
        description: 'Shows how to decrypt multiple encrypted values for a user.',
        contract: 'contracts/basic/decrypt/UserDecryptMultipleValues.sol',
        test: 'test/basic/decrypt/UserDecryptMultipleValues.ts',
        output: 'docs/decryption/user-decrypt-multiple-values.md',
        category: 'Decryption',
        difficulty: 'Intermediate'
    },
    'public-decrypt-single-value': {
        title: 'Public Decrypt Single Value',
        description: 'Demonstrates public decryption mechanism for single values.',
        contract: 'contracts/basic/decrypt/PublicDecryptSingleValue.sol',
        test: 'test/basic/decrypt/PublicDecryptSingleValue.ts',
        output: 'docs/decryption/public-decrypt-single-value.md',
        category: 'Decryption',
        difficulty: 'Intermediate'
    },
    'public-decrypt-multiple-values': {
        title: 'Public Decrypt Multiple Values',
        description: 'Shows public decryption with multiple values.',
        contract: 'contracts/basic/decrypt/PublicDecryptMultipleValues.sol',
        test: 'test/basic/decrypt/PublicDecryptMultipleValues.ts',
        output: 'docs/decryption/public-decrypt-multiple-values.md',
        category: 'Decryption',
        difficulty: 'Intermediate'
    },

    // Access Control
    'access-control-basics': {
        title: 'Access Control Basics',
        description: 'Fundamental access control patterns for FHE contracts.',
        contract: 'contracts/access-control/AccessControlBasics.sol',
        test: 'test/access-control/AccessControlBasics.ts',
        output: 'docs/access-control/basics.md',
        category: 'Access Control',
        difficulty: 'Intermediate'
    },
    'access-control-transient': {
        title: 'Transient Permissions',
        description: 'Using transient storage for temporary access control in computations.',
        contract: 'contracts/access-control/AccessControlTransient.sol',
        test: 'test/access-control/AccessControlTransient.ts',
        output: 'docs/access-control/transient.md',
        category: 'Access Control',
        difficulty: 'Advanced'
    },
    'permission-patterns': {
        title: 'Permission Patterns',
        description: 'Common patterns for managing permissions in complex scenarios.',
        contract: 'contracts/access-control/PermissionPatterns.sol',
        test: 'test/access-control/PermissionPatterns.ts',
        output: 'docs/access-control/patterns.md',
        category: 'Access Control',
        difficulty: 'Advanced'
    },

    // Antipatterns
    'antipattern-handle-reuse': {
        title: 'Antipattern: Handle Reuse',
        description: 'Demonstrates why improper handle reuse leads to errors.',
        contract: 'contracts/antipatterns/HandleReuseErrors.sol',
        test: 'test/antipatterns/HandleReuseErrors.ts',
        output: 'docs/antipatterns/handle-reuse.md',
        category: 'Antipatterns',
        difficulty: 'Intermediate'
    },
    'antipattern-missing-permissions': {
        title: 'Antipattern: Missing Permissions',
        description: 'Shows errors arising from missing permissions.',
        contract: 'contracts/antipatterns/MissingPermissions.sol',
        test: 'test/antipatterns/MissingPermissions.ts',
        output: 'docs/antipatterns/missing-permissions.md',
        category: 'Antipatterns',
        difficulty: 'Beginner'
    },
    'antipattern-signer-mismatch': {
        title: 'Antipattern: Signer Mismatch',
        description: 'Demonstrates signer mismatch errors validation.',
        contract: 'contracts/antipatterns/SignerMismatch.sol',
        test: 'test/antipatterns/SignerMismatch.ts',
        output: 'docs/antipatterns/signer-mismatch.md',
        category: 'Antipatterns',
        difficulty: 'Intermediate'
    },
    'antipattern-view-function': {
        title: 'Antipattern: View Functions',
        description: 'Why view functions cannot decrypt data and workarounds.',
        contract: 'contracts/antipatterns/ViewFunctionAntipattern.sol',
        test: 'test/antipatterns/ViewFunctionAntipattern.ts',
        output: 'docs/antipatterns/view-functions.md',
        category: 'Antipatterns',
        difficulty: 'Intermediate'
    },

    // Advanced
    'blind-auction': {
        title: 'Blind Auction',
        description: 'Sealed-bid auction implementation with confidential bids.',
        contract: 'contracts/advanced/BlindAuction.sol',
        test: 'test/advanced/BlindAuction.ts',
        output: 'docs/advanced/blind-auction.md',
        category: 'Advanced',
        difficulty: 'Advanced'
    },
    'confidential-voting': {
        title: 'Confidential Voting',
        description: 'Secure voting system where votes remain encrypted.',
        contract: 'contracts/advanced/ConfidentialVoting.sol',
        test: 'test/advanced/ConfidentialVoting.ts',
        output: 'docs/advanced/confidential-voting.md',
        category: 'Advanced',
        difficulty: 'Advanced'
    },
    'private-token-swap': {
        title: 'Private Token Swap',
        description: 'Mechanism for swapping tokens confidentially.',
        contract: 'contracts/advanced/PrivateTokenSwap.sol',
        test: 'test/advanced/PrivateTokenSwap.ts',
        output: 'docs/advanced/private-token-swap.md',
        category: 'Advanced',
        difficulty: 'Advanced'
    },

    // OpenZeppelin Confidential Contracts
    'confidential-erc20': {
        title: 'Confidential ERC20 Token',
        description: 'Basic confidential token with encrypted balances (ERC7984).',
        contract: 'contracts/openzeppelin/ConfidentialERC20.sol',
        test: 'test/openzeppelin/ConfidentialERC20.ts',
        output: 'docs/openzeppelin/confidential-erc20.md',
        category: 'OpenZeppelin',
        difficulty: 'Intermediate'
    },
    'erc7984-wrapper': {
        title: 'ERC7984 Wrapper',
        description: 'Wrap standard ERC20 tokens into confidential balances.',
        contract: 'contracts/openzeppelin/ERC7984Wrapper.sol',
        test: 'test/openzeppelin/ERC7984Wrapper.ts',
        output: 'docs/openzeppelin/erc7984-wrapper.md',
        category: 'OpenZeppelin',
        difficulty: 'Intermediate'
    },
    'token-swap-erc7984': {
        title: 'Token Swap ERC7984',
        description: 'Confidential AMM-style token swaps with hidden amounts.',
        contract: 'contracts/openzeppelin/TokenSwapERC7984.sol',
        test: 'test/openzeppelin/TokenSwapERC7984.ts',
        output: 'docs/openzeppelin/token-swap.md',
        category: 'OpenZeppelin',
        difficulty: 'Advanced'
    },
    'vesting-wallet-confidential': {
        title: 'Confidential Vesting Wallet',
        description: 'Time-locked token vesting with encrypted amounts.',
        contract: 'contracts/openzeppelin/VestingWalletConfidential.sol',
        test: 'test/openzeppelin/VestingWalletConfidential.ts',
        output: 'docs/openzeppelin/vesting-wallet.md',
        category: 'OpenZeppelin',
        difficulty: 'Intermediate'
    },
    'confidential-governor': {
        title: 'Confidential Governor',
        description: 'Private voting and governance with encrypted vote weights.',
        contract: 'contracts/openzeppelin/ConfidentialGovernor.sol',
        test: 'test/openzeppelin/ConfidentialGovernor.ts',
        output: 'docs/openzeppelin/governor.md',
        category: 'OpenZeppelin',
        difficulty: 'Advanced'
    }
};
