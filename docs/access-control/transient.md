# Transient Permissions

## Overview

Using transient storage for temporary access control in computations.

## Description

Learn FHE.allowTransient() for gas-efficient temporary permissions

## Technical Details

Transient permissions are valid ONLY for current transaction

**Category**: Access Control  
**Difficulty**: Advanced

## Key Functions

- `computeWithTransient()`
- `demonstrateTransientFailure()`
- `storeWithPersistent()`
- `getStoredValue()`
- `explainTransientUsage()`

## Files

- **Contract**: [`AccessControlTransient.sol`](contracts/access-control/AccessControlTransient.sol)
- **Test**: [`AccessControlTransient.ts`](test/access-control/AccessControlTransient.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/access-control/AccessControlTransient.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts access-control-transient ./output/access-control-transient
```

## Related Examples

- [Access Control Basics](../access-control/access-control-basics.md)
- [Permission Patterns](../access-control/permission-patterns.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
