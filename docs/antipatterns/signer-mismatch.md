# Antipattern: Signer Mismatch

## Overview

Demonstrates signer mismatch errors validation.

## Description

Shows why encryption signer must match tx sender

## Technical Details

Input proof validates that msg.sender == encryption signer

**Category**: Antipatterns  
**Difficulty**: Intermediate

## Key Functions

- `storeValue()`
- `getValue()`

## Files

- **Contract**: [`SignerMismatch.sol`](contracts/antipatterns/SignerMismatch.sol)
- **Test**: [`SignerMismatch.ts`](test/antipatterns/SignerMismatch.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/antipatterns/SignerMismatch.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts antipattern-signer-mismatch ./output/antipattern-signer-mismatch
```

## Related Examples

- [Antipattern: Handle Reuse](../antipatterns/antipattern-handle-reuse.md)
- [Antipattern: Missing Permissions](../antipatterns/antipattern-missing-permissions.md)
- [Antipattern: View Functions](../antipatterns/antipattern-view-function.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
