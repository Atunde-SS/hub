# Encrypt Multiple Values

## Overview

This example shows how to encrypt and handle multiple values in a single transaction.

**Category**: Basic - Encryption  
**Difficulty**: Intermediate

## Key Functions

- `initialize()`
- `encryptedBool()`
- `encryptedUint32()`
- `encryptedAddress()`

## Files

- **Contract**: [`EncryptMultipleValues.sol`](contracts/basic/encrypt/EncryptMultipleValues.sol)
- **Test**: [`EncryptMultipleValues.ts`](test/basic/encrypt/EncryptMultipleValues.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/encrypt/EncryptMultipleValues.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts encrypt-multiple-values ./output/encrypt-multiple-values
```

## Related Examples

- [Encrypt Single Value](../basic---encryption/encrypt-single-value.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
