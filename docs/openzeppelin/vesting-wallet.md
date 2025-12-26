# Confidential Vesting Wallet

## Overview

Time-locked token vesting with encrypted amounts.

## Description

Time-locked token vesting with encrypted amounts

**Category**: OpenZeppelin  
**Difficulty**: Intermediate

## Key Functions

- `release()`
- `getVestedAmount()`

## Files

- **Contract**: [`VestingWalletConfidential.sol`](contracts/openzeppelin/VestingWalletConfidential.sol)
- **Test**: [`VestingWalletConfidential.ts`](test/openzeppelin/VestingWalletConfidential.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/openzeppelin/VestingWalletConfidential.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts vesting-wallet-confidential ./output/vesting-wallet-confidential
```

## Related Examples

- [Confidential ERC20 Token](../openzeppelin/confidential-erc20.md)
- [ERC7984 Wrapper](../openzeppelin/erc7984-wrapper.md)
- [Token Swap ERC7984](../openzeppelin/token-swap-erc7984.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
