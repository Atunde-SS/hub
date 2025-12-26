# Public Decrypt Single Value

## Overview

Demonstrates public decryption mechanism for single values.

## Description

Implements a simple Heads or Tails game demonstrating public, permissionless decryption

## Technical Details

Inherits from ZamaEthereumConfig to access FHE functions like FHE.randEbool() and FHE.verifySignatures().

**Category**: Decryption  
**Difficulty**: Intermediate

## Key Functions

- `headsOrTails()`
- `getGamesCount()`
- `hasHeadsWon()`
- `getWinner()`
- `recordAndVerifyWinner()`

## Files

- **Contract**: [`PublicDecryptSingleValue.sol`](contracts/basic/decrypt/PublicDecryptSingleValue.sol)
- **Test**: [`PublicDecryptSingleValue.ts`](test/basic/decrypt/PublicDecryptSingleValue.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/decrypt/PublicDecryptSingleValue.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts public-decrypt-single-value ./output/public-decrypt-single-value
```

## Related Examples

- [User Decrypt Single Value](../decryption/user-decrypt-single-value.md)
- [User Decrypt Multiple Values](../decryption/user-decrypt-multiple-values.md)
- [Public Decrypt Multiple Values](../decryption/public-decrypt-multiple-values.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
