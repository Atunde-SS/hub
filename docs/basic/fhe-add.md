# FHE Add Operation

## Overview

This example demonstrates how to perform addition operations on encrypted values.

**Category**: Basic - FHE Operations  
**Difficulty**: Beginner

## Key Functions

- `setA()`
- `setB()`
- `computeAPlusB()`
- `result()`

## Files

- **Contract**: [`FHEAdd.sol`](contracts/basic/fhe-operations/FHEAdd.sol)
- **Test**: [`FHEAdd.ts`](test/basic/fhe-operations/FHEAdd.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/fhe-operations/FHEAdd.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts fhe-add ./output/fhe-add
```

## Related Examples

- [FHE Comparison](../basic---fhe-operations/fhe-comparison.md)
- [FHE If-Then-Else](../basic---fhe-operations/fhe-if-then-else.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
