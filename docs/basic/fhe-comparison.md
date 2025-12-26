# FHE Comparison

## Overview

Demonstrates FHE comparison operations (gt, lt, eq, etc).

## Description

Learn how to compare encrypted values

## Technical Details

Demonstrates FHE.eq, FHE.ne, FHE.gt, FHE.lt, FHE.ge, FHE.le

**Category**: Basic - FHE Operations  
**Difficulty**: Beginner

## Key Functions

- `setValues()`
- `checkEqual()`
- `checkNotEqual()`
- `checkGreaterThan()`
- `checkLessThan()`
- `checkGreaterOrEqual()`
- `checkLessOrEqual()`
- `getComparisonResult()`
- `getValueA()`
- `getValueB()`

## Files

- **Contract**: [`FHEComparison.sol`](contracts/basic/FHEComparison.sol)
- **Test**: [`FHEComparison.ts`](test/basic/fhe-operations/FHEComparison.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/fhe-operations/FHEComparison.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts fhe-comparison ./output/fhe-comparison
```

## Related Examples

- [FHE Add Operation](../basic---fhe-operations/fhe-add.md)
- [FHE If-Then-Else](../basic---fhe-operations/fhe-if-then-else.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
