# Encrypt Single Value

## Overview

This example demonstrates the FHE encryption mechanism and highlights a common pitfall developers may encounter.

**Category**: Basic - Encryption  
**Difficulty**: Beginner

## Key Functions

- `initialize()`
- `encryptedUint32()`

## Files

- **Contract**: [`EncryptSingleValue.sol`](contracts/basic/encrypt/EncryptSingleValue.sol)
- **Test**: [`EncryptSingleValue.ts`](test/basic/encrypt/EncryptSingleValue.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/encrypt/EncryptSingleValue.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts encrypt-single-value ./output/encrypt-single-value
```

## Related Examples

- [Encrypt Multiple Values](../basic---encryption/encrypt-multiple-values.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
