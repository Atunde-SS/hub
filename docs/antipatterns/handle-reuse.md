# Antipattern: Handle Reuse

## Overview

Demonstrates why improper handle reuse leads to errors.

## Description

Learn proper encrypted value lifecycle

**Category**: Antipatterns  
**Difficulty**: Intermediate

## Key Functions

- `storeHandle()`
- `addToStored()`
- `getStored()`

## Files

- **Contract**: [`HandleReuseErrors.sol`](contracts/antipatterns/HandleReuseErrors.sol)
- **Test**: [`HandleReuseErrors.ts`](test/antipatterns/HandleReuseErrors.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/antipatterns/HandleReuseErrors.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts antipattern-handle-reuse ./output/antipattern-handle-reuse
```

## Related Examples

- [Antipattern: Missing Permissions](../antipatterns/antipattern-missing-permissions.md)
- [Antipattern: Signer Mismatch](../antipatterns/antipattern-signer-mismatch.md)
- [Antipattern: View Functions](../antipatterns/antipattern-view-function.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
