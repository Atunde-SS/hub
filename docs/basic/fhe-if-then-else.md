# FHE If-Then-Else

## Overview

This example shows conditional operations on encrypted values using FHE.

**Category**: Basic - FHE Operations  
**Difficulty**: Intermediate

## Key Functions

- `setA()`
- `setB()`
- `computeMax()`
- `result()`

## Files

- **Contract**: [`FHEIfThenElse.sol`](contracts/basic/fhe-operations/FHEIfThenElse.sol)
- **Test**: [`FHEIfThenElse.ts`](test/basic/fhe-operations/FHEIfThenElse.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/fhe-operations/FHEIfThenElse.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts fhe-if-then-else ./output/fhe-if-then-else
```

## Related Examples

- [FHE Add Operation](../basic---fhe-operations/fhe-add.md)
- [FHE Comparison](../basic---fhe-operations/fhe-comparison.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
