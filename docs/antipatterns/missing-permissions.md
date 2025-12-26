# Antipattern: Missing Permissions

## Overview

Shows errors arising from missing permissions.

## Description

Learn from permission errors

**Category**: Antipatterns  
**Difficulty**: Beginner

## Key Functions

- `storeValue_MissingAllowThis()`
- `storeValue_MissingUserPermission()`
- `storeValue_Correct()`
- `getValue()`

## Files

- **Contract**: [`MissingPermissions.sol`](contracts/antipatterns/MissingPermissions.sol)
- **Test**: [`MissingPermissions.ts`](test/antipatterns/MissingPermissions.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/antipatterns/MissingPermissions.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts antipattern-missing-permissions ./output/antipattern-missing-permissions
```

## Related Examples

- [Antipattern: Handle Reuse](../antipatterns/antipattern-handle-reuse.md)
- [Antipattern: Signer Mismatch](../antipatterns/antipattern-signer-mismatch.md)
- [Antipattern: View Functions](../antipatterns/antipattern-view-function.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
