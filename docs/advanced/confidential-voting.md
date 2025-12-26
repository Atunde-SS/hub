# Confidential Voting

## Overview

Secure voting system where votes remain encrypted.

## Description

Sealed voting where votes remain encrypted

**Category**: Advanced  
**Difficulty**: Advanced

## Key Functions

- `vote()`
- `endVoting()`
- `getVotes()`

## Files

- **Contract**: [`ConfidentialVoting.sol`](contracts/advanced/ConfidentialVoting.sol)
- **Test**: [`ConfidentialVoting.ts`](test/advanced/ConfidentialVoting.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/advanced/ConfidentialVoting.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts confidential-voting ./output/confidential-voting
```

## Related Examples

- [Blind Auction](../advanced/blind-auction.md)
- [Private Token Swap](../advanced/private-token-swap.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
