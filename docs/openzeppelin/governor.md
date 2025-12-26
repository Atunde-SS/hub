# Confidential Governor

## Overview

Private voting and governance with encrypted vote weights.

## Description

Private voting and governance with encrypted votes

**Category**: OpenZeppelin  
**Difficulty**: Advanced

## Key Functions

- `setVotingPower()`
- `propose()`
- `castVote()`

## Files

- **Contract**: [`ConfidentialGovernor.sol`](contracts/openzeppelin/ConfidentialGovernor.sol)
- **Test**: [`ConfidentialGovernor.ts`](test/openzeppelin/ConfidentialGovernor.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/openzeppelin/ConfidentialGovernor.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts confidential-governor ./output/confidential-governor
```

## Related Examples

- [Confidential ERC20 Token](../openzeppelin/confidential-erc20.md)
- [ERC7984 Wrapper](../openzeppelin/erc7984-wrapper.md)
- [Token Swap ERC7984](../openzeppelin/token-swap-erc7984.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
