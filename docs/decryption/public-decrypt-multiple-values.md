# Public Decrypt Multiple Values

## Overview

Shows public decryption with multiple values.

## Description

Implements a simple 8-sided Die Roll game demonstrating public, permissionless decryption

## Technical Details

Inherits from ZamaEthereumConfig to access FHE functions like FHE.randEbool() and FHE.verifySignatures().

**Category**: Decryption  
**Difficulty**: Intermediate

## Key Functions

- `highestDieRoll()`
- `getGamesCount()`
- `getPlayerADieRoll()`
- `getPlayerBDieRoll()`
- `getWinner()`
- `isGameRevealed()`
- `recordAndVerifyWinner()`

## Files

- **Contract**: [`PublicDecryptMultipleValues.sol`](contracts/basic/decrypt/PublicDecryptMultipleValues.sol)
- **Test**: [`PublicDecryptMultipleValues.ts`](test/basic/decrypt/PublicDecryptMultipleValues.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/decrypt/PublicDecryptMultipleValues.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts public-decrypt-multiple-values ./output/public-decrypt-multiple-values
```

## Related Examples

- [User Decrypt Single Value](../decryption/user-decrypt-single-value.md)
- [User Decrypt Multiple Values](../decryption/user-decrypt-multiple-values.md)
- [Public Decrypt Single Value](../decryption/public-decrypt-single-value.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
