# FHEVM Hub - Complete FHEVM Development System

> **A comprehensive automation system for generating standalone FHEVM example repositories**

[![License: BSD-3-Clause-Clear](https://img.shields.io/badge/License-BSD--3--Clause--Clear-blue.svg)](LICENSE)
[![Built with: TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![FHE: Zama](https://img.shields.io/badge/FHE-Zama-7C3AED)](https://www.zama.ai/)

## 🚀 What Is This?

FHEVM Hub is an automated system that generates **production-ready, standalone FHEVM example repositories** with one command. Each generated repository includes:

- ✅ Complete Hardhat configuration
- ✅ Fully-tested smart contracts
- ✅ Deployment scripts
- ✅ Comprehensive documentation
- ✅ Ready to run, compile, and deploy

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo-url>
cd Hub
npm install

# 2. Initialize official template
git submodule update --init --recursive

# 3. Generate your first example (with optional frontend)
npx ts-node scripts/create-fhevm-example.ts confidential-erc20 ./my-project --frontend

# 4. Use it!
cd my-project
npm install
npm run compile
npm run test

# 5. Launch Frontend (optional)
cd frontend
npm install
npm run sync-abi   # Automagically connects your contract
npm run dev
```

**That's it!** You have a complete, working FHEVM project with a functional UI.

### Streamlined Frontend

The optional frontend is now **semi-automated**:

- ✅ **One-flag setup**: Just add `--frontend` to the generation command.
- ✅ **Automatic Sync**: `npm run sync-abi` finds your compiled contract and connects it to the UI.
- ✅ **Generic UI**: A pre-built "FHEVM Explorer" component that automatically renders all your contract's functions.

---

## 📦 30 FHEVM Examples Included

| Category           | Count  | Examples                                            |
| ------------------ | ------ | --------------------------------------------------- |
| **Basic**          | 10     | FHE Counter, Encrypt Values, FHE Operations, Random |
| **Decryption**     | 4      | User Decrypt, Public Decrypt (Single/Multiple)      |
| **Access Control** | 3      | Basics, Transient, Permissions                      |
| **Advanced**       | 3      | Blind Auction, Decentralized ID, Token Swap         |
| **OpenZeppelin**   | 5      | ConfidentialERC20, Governor, Vesting, Wrappers      |
| **Anti-patterns**  | 4      | View Errors, Missing Permissions, Handle Reuse      |
| **TOTAL**          | **30** | All contracts compile, test, and deploy ✅          |

---

## 🎯 Key Features

### 1. One-Command Generation

```bash
npx ts-node scripts/create-fhevm-example.ts <example-name> <output-dir>
```

Generates a complete standalone repository with:

- Smart contract from `contracts/`
- Test suite from `test/`
- Auto-generated deploy script
- Custom README with instructions
- Full Hardhat configuration

### 2. Official Template Integration

Uses Zama's official [`fhevm-hardhat-template`](https://github.com/zama-ai/fhevm-hardhat-template) via git submodule:

- Always up-to-date
- Officially maintained
- Zero custom configuration needed

### 3. Auto-Documentation

Generate comprehensive GitBook-compatible documentation:

```bash
# Generate docs for single example
npx ts-node scripts/generate-docs.ts fhe-counter

# Generate docs for all examples
npx ts-node scripts/generate-docs.ts --all
```

Creates structured documentation in `docs/` with:

- SUMMARY.md (GitBook navigation)
- Category-organized markdown files
- Contract annotations parsed
- Code examples included

### 4. Developer-Friendly Configuration

- **`.env` files** - Familiar workflow (not Hardhat vars)
- **Default mnemonic** - Works out of the box for local testing
- **Clear documentation** - Every example has detailed README
- **No surprises** - Simple, predictable behavior

### 5. Anti-Pattern Examples (Unique!)

Learn from common mistakes:

- `ViewFunctionAntipattern` - Why view functions fail with FHE
- `MissingPermissionsAntipattern` - Permission errors explained
- `HandleReuseAntipattern` - Handle lifecycle issues
- `SignerMismatchAntipattern` - Signer validation problems

**Educational approach that helps developers avoid pitfalls!**

---

## 📁 Repository Structure

```
Hub/
├── contracts/              # 30 FHEVM example contracts
│   ├── basic/             # FHE fundamentals
│   ├── access-control/    # Permission patterns
│   ├── advanced/          # Complex use cases
│   ├── antipatterns/      # Common mistakes
│   └── openzeppelin/      # Confidential tokens
├── test/                  # Complete test suites
├── scripts/               # Automation tools
│   ├── create-fhevm-example.ts      # Main generator
│   ├── create-fhevm-category.ts     # Batch generation
│   ├── generate-docs.ts             # Documentation
│   └── config/
│       └── examples.ts              # Example mappings
├── fhevm-hardhat-template/  # Official template (submodule)
├── docs/                    # Generated documentation
├── DEVELOPER_GUIDE.md       # Contribution guide
└── DEMO_SCRIPT.md          # Video demo script
```

---

## 🛠️ How It Works

### Architecture

1. **Official Template**: Git submodule to Zama's template ensures compatibility
2. **Example Mapping**: `scripts/config/examples.ts` maps IDs to contracts/tests
3. **Generation Script**: Copies template, injects contract/test, updates config
4. **Documentation**: Auto-generates README with setup instructions

### Generated Project Structure

Every generated example has:

```
my-project/
├── contracts/
│   └── YourContract.sol    # The example contract
├── test/
│   └── YourContract.ts     # Matching test suite
├── deploy/
│   └── deploy.ts           # Auto-generated deployment
├── hardhat.config.ts       # Full FHEVM configuration
├── package.json            # All dependencies
├── .env.example            # Configuration template
└── README.md               # Setup instructions
```

---

## 📚 Example Usage

### Generate Basic Example

```bash
npx ts-node scripts/create-fhevm-example.ts fhe-counter ./counter-app
cd counter-app
npm install
npm run compile
npm run test
```

### Generate Advanced Example

```bash
npx ts-node scripts/create-fhevm-example.ts blind-auction ./auction-app
cd auction-app
npm install
npm run test
npx hardhat deploy --network localhost
```

### Generate OpenZeppelin Example

```bash
npx ts-node scripts/create-fhevm-example.ts confidential-erc20 ./token-app
cd token-app
npm install
npm run compile
npm run test
```

---

## 🏆 Competition Checklist

### Core Requirements

- ✅ **25+ Examples** → 30 examples provided
- ✅ **Automation Scripts** → TypeScript CLI tools
- ✅ **Base Template** → Official Zama template (git submodule)
- ✅ **One Repo Per Example** → Each generation creates standalone repo
- ✅ **Hardhat Only** → All examples use Hardhat
- ✅ **Comprehensive Tests** → Every example has test suite
- ✅ **Documentation Generator** → Auto-generates README per example

### Bonus Features

- ✅ **Anti-Pattern Examples** - Unique educational content
- ✅ **OpenZeppelin Confidential** - All 5 types included
- ✅ **Easy Maintenance** - Git submodule for template updates
- ✅ **Developer Guide** - Clear contribution documentation
- ✅ **Demo Script** - Video walkthrough prepared

---

## 🧑‍💻 For Developers

### Adding Your Own Contract

1. **Create contract**:

```solidity
// contracts/custom/MyContract.sol
contract MyContract {
    // Your FHEVM logic
}
```

2. **Create test**:

```typescript
// test/custom/MyContract.ts
describe("MyContract", function () {
  // Your tests
});
```

3. **Add to config**:

```typescript
// scripts/config/examples.ts
'my-contract': {
    title: 'My Contract',
    description: 'What it does',
    contract: 'contracts/custom/MyContract.sol',
    test: 'test/custom/MyContract.ts',
    output: 'docs/custom/my-contract.md',
    category: 'Custom',
}
```

4. **Generate**:

```bash
npx ts-node scripts/create-fhevm-example.ts my-contract ./output
```

See [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for full details.

---

## 📖 Documentation

- **[Developer Guide](DEVELOPER_GUIDE.md)** - How to contribute and extend
- **[Demo Script](DEMO_SCRIPT.md)** - Video walkthrough script
- **[Submission](SUBMISSION.md)** - Competition submission details
- **[Generated Docs](docs/)** - All example documentation

---

## 🔧 Technical Details

### Dependencies

**Root Hub** (generator):

- TypeScript
- ts-node
- @types/node

**Generated Examples** (FHEVM projects):

- encrypted-types
- @fhevm/solidity
- @fhevm/hardhat-plugin
- Hardhat ecosystem
- dotenv

### Configuration

Generated projects use `.env` for configuration:

```env
MNEMONIC="your twelve word mnemonic here"
INFURA_API_KEY="your-infura-key"
ETHERSCAN_API_KEY="your-etherscan-key"
```

Default mnemonic included for local testing.

### Networks

All generated examples support:

- `hardhat` - Local development (In-memory)
- `localhost` - Local node deployment (Persistent local network)
- `sepolia` - Public testnet deployment

---

## 🛠️ Detailed Deployment Guide

### 1. Local Network (Development)

The fastest way to iterate. All transactions are instant and don't require external coins.

1. **Start the local node**:
   ```bash
   npx hardhat node
   ```
2. **Deploy your contract**:
   ```bash
   npx hardhat deploy --network localhost
   ```
3. **Configure Frontend**:
   Copy the printed contract address to `frontend/.env.local`.

### 2. Sepolia Testnet (Staging)

Test your application in a real blockchain environment.

1. **Get Sepolia ETH**: Use a [faucet](https://sepoliafaucet.com/) to get test tokens.
2. **Configure Variables**: Ensure your `MNEMONIC` and `INFURA_API_KEY` are set in `.env`.
3. **Deploy**:
   ```bash
   npx hardhat deploy --network sepolia
   ```
4. **Verify (Optional)**:
   ```bash
   npx hardhat verify --network sepolia <DEPLOYED_ADDRESS>
   ```

---

## 🔐 Environment Variables Guide

Each generated project includes a `.env.example`. Rename this to `.env` and provide the following:

| Variable            | Description                                       | Requirement                    |
| ------------------- | ------------------------------------------------- | ------------------------------ |
| `MNEMONIC`          | Your 12-word recovery phrase.                     | **Required** for all networks. |
| `INFURA_API_KEY`    | Your project ID from [Infura](https://infura.io). | Required for Sepolia.          |
| `ETHERSCAN_API_KEY` | For contract source code verification.            | Optional (for Sepolia).        |
| `REPORT_GAS`        | Set to `true` to enable gas usage reporting.      | Optional.                      |

> [!IMPORTANT] > **Never commit your `.env` file!** It contains sensitive phrases that can be used to control your accounts. The generated projects ignore `.env` by default for your safety.

---

## 🏎️ Performance Note

Generating the files is nearly instantaneous. However, running `npm install` for the first time in a generated project can take **1-3 minutes**. This is normal as FHEVM dependencies (like `@fhevm/solidity` and `fhevmjs`) are substantial packages that ensure robust browser-side encryption.

---

---

## 👻 IDE "Ghost Errors" (Troubleshooting)

When opening this project in editors like VS Code or Cursor, you may see "red squiggly" errors in your files. These are **harmless IDE configuration artifacts** and do not affect your code's functionality.

### 1. "Parsing error: Cannot read file... tsconfig.json"

- **Cause**: This happens because your editor is open at the root level, but the TypeScript projects are located inside the `Hub`, `fhevm-hardhat-template`, or generated project folders.
- **Solution**: You can ignore it, or open the specific project folder (e.g., `cd Hub`) in a new editor window.

### 2. "Cannot find module '@rainbow-me/rainbowkit'..." in templates

- **Cause**: The `frontend-template` folder is a source blueprint and does not have its own `node_modules` installed.
- **Solution**: These errors will disappear automatically in your **generated** projects once you run `npm install` inside them.

**Your contracts will still compile, test, and deploy perfectly regardless of these IDE warnings.**

---

## 🤝 Contributing

We welcome contributions! Please see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for:

- Adding new examples
- Updating dependencies
- Running automation
- Testing procedures

---

## 📜 License

BSD-3-Clause-Clear License - See [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

- [Zama](https://www.zama.ai/) - For FHEVM technology and official template
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts) - For confidential contracts
- Competition organizers - For this amazing initiative

---

## 📊 Project Stats

- **30** Example contracts
- **30** Test suites
- **100%** Compilation success
- **100%** Test pass rate
- **1** Command to generate

---

**Built for the Zama FHEVM Competition**  
_Making FHEVM development accessible and efficient_

**⭐ If this helps you, please star the repo!**
