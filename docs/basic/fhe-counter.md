# FHE Counter

## Overview

This example demonstrates how to build a confidential counter using FHEVM, in comparison to a simple counter.

## Description

This contract demonstrates the basics of FHEVM by implementing an encrypted counter

## Technical Details

This example shows:

**Category**: Basic  
**Difficulty**: Beginner

## Key Functions

- `getCount()`
- `increment()`
- `decrement()`
- `reset()`

## Files

- **Contract**: [`FHECounter.sol`](contracts/basic/FHECounter.sol)
- **Test**: [`FHECounter.ts`](test/basic/FHECounter.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/FHECounter.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts fhe-counter ./output/fhe-counter
```

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
