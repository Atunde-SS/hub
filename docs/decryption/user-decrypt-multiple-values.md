# User Decrypt Multiple Values

## Overview

Shows how to decrypt multiple encrypted values for a user.

**Category**: Decryption  
**Difficulty**: Intermediate

## Key Functions

- `initialize()`
- `encryptedBool()`
- `encryptedUint32()`
- `encryptedUint64()`

## Files

- **Contract**: [`UserDecryptMultipleValues.sol`](contracts/basic/decrypt/UserDecryptMultipleValues.sol)
- **Test**: [`UserDecryptMultipleValues.ts`](test/basic/decrypt/UserDecryptMultipleValues.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/decrypt/UserDecryptMultipleValues.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts user-decrypt-multiple-values ./output/user-decrypt-multiple-values
```

## Related Examples

- [User Decrypt Single Value](../decryption/user-decrypt-single-value.md)
- [Public Decrypt Single Value](../decryption/public-decrypt-single-value.md)
- [Public Decrypt Multiple Values](../decryption/public-decrypt-multiple-values.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
