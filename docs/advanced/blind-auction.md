# Blind Auction

## Overview

Sealed-bid auction implementation with confidential bids.

## Description

A complete implementation of a blind auction using FHEVM

## Technical Details

This demonstrates:

**Category**: Advanced  
**Difficulty**: Advanced

## Key Functions

- `submitBid()`
- `stopAuction()`
- `determineWinner()`
- `determineWinnerSimplified()`
- `getMyBid()`
- `getHighestBid()`
- `hasBid()`
- `getBidderCount()`
- `getTimeRemaining()`
- `grantAuctioneerViewPermission()`
- `explainAuctionMechanism()`
- `explainSecurityConsiderations()`

## Files

- **Contract**: [`BlindAuction.sol`](contracts/advanced/BlindAuction.sol)
- **Test**: [`BlindAuction.ts`](test/advanced/BlindAuction.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/advanced/BlindAuction.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts blind-auction ./output/blind-auction
```

## Related Examples

- [Confidential Voting](../advanced/confidential-voting.md)
- [Private Token Swap](../advanced/private-token-swap.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
