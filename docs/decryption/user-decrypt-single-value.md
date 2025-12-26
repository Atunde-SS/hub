# User Decrypt Single Value

## Overview

Demonstrates user decryption and permission requirements.

**Category**: Decryption  
**Difficulty**: Intermediate

## Key Functions

- `initializeUint32()`
- `initializeUint32Wrong()`
- `encryptedUint32()`

## Files

- **Contract**: [`UserDecryptSingleValue.sol`](contracts/basic/decrypt/UserDecryptSingleValue.sol)
- **Test**: [`UserDecryptSingleValue.ts`](test/basic/decrypt/UserDecryptSingleValue.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/decrypt/UserDecryptSingleValue.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts user-decrypt-single-value ./output/user-decrypt-single-value
```

## Related Examples

- [User Decrypt Multiple Values](../decryption/user-decrypt-multiple-values.md)
- [Public Decrypt Single Value](../decryption/public-decrypt-single-value.md)
- [Public Decrypt Multiple Values](../decryption/public-decrypt-multiple-values.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
