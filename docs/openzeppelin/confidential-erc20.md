# Confidential ERC20 Token

## Overview

Basic confidential token with encrypted balances (ERC7984).

## Description

ERC7984-inspired confidential token with encrypted balances

## Technical Details

Educational example of confidential tokens using FHEVM

**Category**: OpenZeppelin  
**Difficulty**: Intermediate

## Key Functions

- `mint()`
- `transfer()`
- `balanceOf()`

## Files

- **Contract**: [`ConfidentialERC20.sol`](contracts/openzeppelin/ConfidentialERC20.sol)
- **Test**: [`ConfidentialERC20.ts`](test/openzeppelin/ConfidentialERC20.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/openzeppelin/ConfidentialERC20.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts confidential-erc20 ./output/confidential-erc20
```

## Related Examples

- [ERC7984 Wrapper](../openzeppelin/erc7984-wrapper.md)
- [Token Swap ERC7984](../openzeppelin/token-swap-erc7984.md)
- [Confidential Vesting Wallet](../openzeppelin/vesting-wallet-confidential.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)
