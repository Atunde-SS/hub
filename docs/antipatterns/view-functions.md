# Antipattern: View Functions

## Overview

Why view functions cannot decrypt data and workarounds.

## Description

This contract demonstrates a critical FHEVM limitation

## Technical Details

🚫 CRITICAL ANTI-PATTERN:

**Category**: Antipatterns  
**Difficulty**: Intermediate

## Key Functions

- `setValues()`
- `getValueA()`
- `getPrecomputedSum()`
- `computeSumInView()`
- `computeSumCorrect()`
- `getDecryptedValueWrong()`
- `hasHighValue()`
- `computeIsHighValue()`
- `getIsHighValueHandle()`
- `demonstratePrecomputePattern()`
- `computeSum()`
- `getSum()`
- `demonstrateClientSidePattern()`
- `getValues()`
- `demonstratePublicDecryptionPattern()`
- `requestDecryption()`
- `callbackResult()`
- `getResult()`
- `explainWhyViewDoesntWork()`
- `explainCommonPatterns()`

## Files

- **Contract**: [`ViewFunctionAntipattern.sol`](contracts/antipatterns/ViewFunctionAntipattern.sol)
- **Test**: [`ViewFunctionAntipattern.ts`](test/antipatterns/ViewFunctionAntipattern.ts)

## Quick Start

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/antipatterns/ViewFunctionAntipattern.ts

# Generate standalone project
ts-node scripts/create-fhevm-example.ts antipattern-view-function ./output/antipattern-view-function
```

## Related Examples

- [Antipattern: Handle Reuse](../antipatterns/antipattern-handle-reuse.md)
- [Antipattern: Missing Permissions](../antipatterns/antipattern-missing-permissions.md)
- [Antipattern: Signer Mismatch](../antipatterns/antipattern-signer-mismatch.md)

## Resources

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Hardhat Documentation](https://hardhat.org/docs)
