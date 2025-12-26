# ERC7984 Wrapper

## Overview

Wrap standard ERC20 tokens into confidential balances.

## Description

Wrap standard ERC20 tokens into confidential balances

**Category**: OpenZeppelin  
**Difficulty**: Intermediate

## Key Functions

- `transferFrom()`
- `transfer()`
- `wrap()`
- `encryptedBalanceOf()`

## Files

- **Contract**: [`ERC7984Wrapper.sol`](contracts/openzeppelin/ERC7984Wrapper.sol)
- **Test**: [`ERC7984Wrapper.ts`](test/openzeppelin/ERC7984Wrapper.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/openzeppelin/ERC7984Wrapper.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts erc7984-wrapper ./output/erc7984-wrapper
```

## Related Examples

- [Confidential ERC20 Token](../openzeppelin/confidential-erc20.md)
- [Token Swap ERC7984](../openzeppelin/token-swap-erc7984.md)
- [Confidential Vesting Wallet](../openzeppelin/vesting-wallet-confidential.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
