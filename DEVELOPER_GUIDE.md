# Developer Guide - Hub Repository

## Adding New Contract Examples

### 1. Create the Contract

Place your contract in the appropriate category:

```
contracts/
├── basic/           # Simple FHE operations
├── access-control/  # Permission patterns
├── advanced/        # Complex applications
├── antipatterns/    # Common mistakes
└── openzeppelin/    # Confidential tokens
```

**Example**: Creating a new basic example

```solidity
// contracts/basic/MyExample.sol
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract MyExample is ZamaEthereumConfig {
    // Your implementation
}
```

### 2. Create the Test

Create matching test file in `test/` directory:

```typescript
// test/basic/MyExample.ts
import "@nomicfoundation/hardhat-chai-matchers";
import { ethers, fhevm } from "hardhat";
import { MyExample } from "../../types";
import { expect } from "chai";

async function deployFixture() {
  const factory = await ethers.getContractFactory("MyExample");
  const contract = (await factory.deploy()) as unknown as MyExample;
  return { contract, address: await contract.getAddress() };
}

describe("MyExample", function () {
  beforeEach(async function () {
    if (!fhevm.isMock) this.skip();
  });

  it("should work correctly", async function () {
    const { contract } = await deployFixture();
    // Your tests
  });
});
```

### 3. Compile and Test

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test test/basic/MyExample.ts
```

### 4. Add to Automation Config

Update `scripts/config/examples.ts`:

```typescript
{
    id: 'my-example',
    name: 'My Example',
    description: 'Description of what it demonstrates',
    category: 'basic',
    difficulty: 'beginner',
    contractPath: 'contracts/basic/MyExample.sol',
    testPath: 'test/basic/MyExample.ts'
}
```

## Updating FHEVM Dependencies

### Check Current Version

```bash
npm list @fhevm/solidity
```

### Update to Latest

```bash
npm update @fhevm/solidity
npm update @fhevm/hardhat-plugin
```

### Breaking Changes Checklist

1. Check [FHEVM Changelog](https://github.com/zama-ai/fhevm)
2. Update import statements if needed
3. Recompile all contracts: `npx hardhat compile --force`
4. Run full test suite: `npx hardhat test`
5. Fix any API changes in contracts
6. Update documentation if functions changed

### Common Migration Issues

**FHE API Changes**:

- `FHE.allow()` signature updates
- New encrypted types (euint64, euint128)
- Permission system changes

**Fix Pattern**:

```solidity
// Old
FHE.allow(value, address);

// New (if changed)
FHE.allow(value, address, msg.sender);
```

## Running Automation Scripts

### Generate Single Example Repository

```bash
# Format: ts-node scripts/create-fhevm-example.ts <example-id> <output-path>
ts-node scripts/create-fhevm-example.ts fhe-counter ./output/fhe-counter

# Test the generated repository
cd ./output/fhe-counter
npm install
npm run compile
npm run test
```

### Generate Category Project

```bash
# Generate all basic examples in one project
ts-node scripts/create-fhevm-category.ts basic ./output/basic-examples

cd ./output/basic-examples
npm install
npm run compile
npm run test
```

### Generate Documentation

```bash
# Generate docs for all examples
ts-node scripts/generate-docs.ts

# Output to: docs/ directory (GitBook compatible)
```

## Troubleshooting

### Compilation Errors

**Problem**: "Module not found" errors

```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Problem**: "Invalid character in string"

```
# Solution: Remove unicode characters from Solidity strings
# Solidity doesn't support emojis or special unicode
```

**Problem**: "Identifier not found"

```
# Solution: Check imports
import { FHE, euint32, ebool } from "@fhevm/solidity/lib/FHE.sol";
```

### Test Failures

**Problem**: "fhevm is not defined"

```typescript
// Solution: Import fhevm from hardhat
import { ethers, fhevm } from "hardhat";
```

**Problem**: "Property 'emit' does not exist"

```typescript
// Solution: Add hardhat-chai-matchers import
import "@nomicfoundation/hardhat-chai-matchers";
```

**Problem**: Type mismatch on deployment

```typescript
// Solution: Use double casting
const contract = (await factory.deploy()) as unknown as ContractName;
```

### Automation Issues

**Problem**: Generated repo doesn't compile

- Check base-template is up to date
- Verify contract/test paths in config
- Ensure all dependencies in package.json

**Problem**: Missing files in output

- Verify source files exist
- Check file paths are absolute
- Review automation script logs

## Testing Procedures

### Run All Tests

```bash
npx hardhat test
```

### Run Specific Category

```bash
npx hardhat test test/basic/*.ts
npx hardhat test test/openzeppelin/*.ts
```

### Run Single Test File

```bash
npx hardhat test test/basic/EncryptSingleValue.ts
```

### Test with Coverage

```bash
npx hardhat coverage
```

### Mock vs Real Network

```typescript
// Tests skip if not in mock mode
beforeEach(async function () {
  if (!fhevm.isMock) {
    console.warn("Skipping on real network");
    this.skip();
  }
});
```

## Contribution Workflow

1. **Create Branch**

   ```bash
   git checkout -b feature/my-example
   ```

2. **Add Contract + Test**

   - Follow naming conventions
   - Add comprehensive tests
   - Include educational comments

3. **Verify Quality**

   ```bash
   npx hardhat compile
   npx hardhat test
   npm run lint # if configured
   ```

4. **Update Documentation**

   - Add example to README
   - Update config/examples.ts
   - Run generate-docs.ts

5. **Submit**

   - Ensure all tests pass
   - Zero compilation errors
   - Documentation updated

6. **Quick Reference**

### File Structure

```
Hub/
├── contracts/               # 30 FHEVM example contracts (source)
├── test/                    # 30 Test suites (source)
├── scripts/                 # Automation & generator tools
├── docs/                    # Generated GitBook documentation
├── fhevm-hardhat-template/ # Core backend Hardhat template (Submodule)
├── frontend-template/      # Optional semi-automated UI template
└── hardhat.config.ts        # Global Hardhat config for testing source
```

### Common Commands

```bash
npm install              # Install Hub dependencies
git submodule update --init --recursive   # Initialize template
npx hardhat compile      # Compile all source contracts
npx hardhat test         # Run all tests centrally
# Generator
npx ts-node scripts/create-fhevm-example.ts <example> <path> [--frontend]
```

### Important Files

- `hardhat.config.ts` - Hardhat configuration
- `scripts/config/examples.ts` - Example definitions
- `package.json` - Dependencies
- `tsconfig.json` - TypeScript config

## Need Help?

- **FHEVM Docs**: https://docs.zama.ai/fhevm
- **Hardhat Docs**: https://hardhat.org/docs
- **OpenZeppelin Confidential**: https://github.com/OpenZeppelin/openzeppelin-confidential-contracts
