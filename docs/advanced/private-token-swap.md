# Private Token Swap

## Overview

Mechanism for swapping tokens confidentially.

## Description

Swap tokens while keeping amounts private

**Category**: Advanced  
**Difficulty**: Advanced

## Key Functions

- `depositTokenA()`
- `depositTokenB()`
- `swapAforB()`
- `getBalanceTokenA()`
- `getBalanceTokenB()`

## Files

- **Contract**: [`PrivateTokenSwap.sol`](contracts/advanced/PrivateTokenSwap.sol)
- **Test**: [`PrivateTokenSwap.ts`](test/advanced/PrivateTokenSwap.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/advanced/PrivateTokenSwap.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts private-token-swap ./output/private-token-swap
```

## Related Examples

- [Blind Auction](../advanced/blind-auction.md)
- [Confidential Voting](../advanced/confidential-voting.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
