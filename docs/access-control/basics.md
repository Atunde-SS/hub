# Access Control Basics

## Overview

Fundamental access control patterns for FHE contracts.

## Description

This contract teaches FHEVM's Access Control List (ACL) system

**Category**: Access Control  
**Difficulty**: Intermediate

## Key Functions

- `depositWithFullPermissions()`
- `incrementCounterContractOnly()`
- `grantUserViewPermission()`
- `computeTemporaryValue()`
- `depositWrong_MissingAllowThis()`
- `depositWrong_MissingUserPermission()`
- `depositWrong_NoPermissions()`
- `shareBalanceWith()`
- `getBalance()`
- `getCounter()`

## Files

- **Contract**: [`AccessControlBasics.sol`](contracts/access-control/AccessControlBasics.sol)
- **Test**: [`AccessControlBasics.ts`](test/access-control/AccessControlBasics.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/access-control/AccessControlBasics.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts access-control-basics ./output/access-control-basics
```

## Related Examples

- [Transient Permissions](../access-control/access-control-transient.md)
- [Permission Patterns](../access-control/permission-patterns.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
