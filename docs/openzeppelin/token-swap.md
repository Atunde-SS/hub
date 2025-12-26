# Token Swap ERC7984

## Overview

Confidential AMM-style token swaps with hidden amounts.

## Description

Swap two confidential tokens with hidden amounts

**Category**: OpenZeppelin  
**Difficulty**: Advanced

## Key Functions

- `depositTokenA()`
- `swapAforB()`
- `getBalanceTokenA()`
- `getBalanceTokenB()`

## Files

- **Contract**: [`TokenSwapERC7984.sol`](contracts/openzeppelin/TokenSwapERC7984.sol)
- **Test**: [`TokenSwapERC7984.ts`](test/openzeppelin/TokenSwapERC7984.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/openzeppelin/TokenSwapERC7984.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts token-swap-erc7984 ./output/token-swap-erc7984
```

## Related Examples

- [Confidential ERC20 Token](../openzeppelin/confidential-erc20.md)
- [ERC7984 Wrapper](../openzeppelin/erc7984-wrapper.md)
- [Confidential Vesting Wallet](../openzeppelin/vesting-wallet-confidential.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
