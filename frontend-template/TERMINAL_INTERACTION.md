# Terminal-Based Contract Interaction Guide

> **Bypass all frontend errors.** Interact with contracts directly from CLI without MetaMask, WalletConnect, or Reown.

---

## ✅ All Contracts Work Via Terminal

**Every generated contract works perfectly without frontend.** The Reown/MetaMask errors are UI-only.

---

## 🚀 Quick Start (3 Steps)

### 1. Start Local Blockchain

```bash
npx hardhat node
```

### 2. Open Interactive Console

```bash
npx hardhat console
```

### 3. Deploy & Interact

```javascript
// Deploy
const factory = await ethers.getContractFactory("YourContract");
const contract = await factory.deploy();
await contract.waitForDeployment();
const address = await contract.getAddress();
console.log("Deployed:", address);

// Get accounts
const [deployer, alice] = await ethers.getSigners();

// Call functions (example for ConfidentialERC20)
await contract.connect(deployer).mint(alice.address, 1000);
const balance = await contract.connect(alice).balanceOf(alice.address);
console.log("Balance:", balance);
```

---

## 📖 Three Interaction Methods

### Method 1: Hardhat Console (Easiest)

```bash
npx hardhat console

// Interactive JavaScript environment
// Full access to ethers, contract, signers
```

**Best for**: Quick testing, exploration

---

### Method 2: Test Runner (Automated)

```bash
npm run test
```

**Best for**: Verification, CI/CD, reproducibility

---

### Method 3: Custom Script

Create `scripts/interact.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("YourContract");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  // ... more interactions
}

main().catch(console.error);
```

Run it:
```bash
npx hardhat run scripts/interact.ts --network localhost
```

**Best for**: Automation, complex workflows

---

## 🎯 Common Patterns

### Deploy & Get Address

```javascript
const factory = await ethers.getContractFactory("ConfidentialERC20");
const contract = await factory.deploy();
await contract.waitForDeployment();
const address = await contract.getAddress();
```

### Get Signers

```javascript
const [deployer, alice, bob] = await ethers.getSigners();
console.log("Deployer:", deployer.address);
console.log("Alice:", alice.address);
```

### Call Function (State Change)

```javascript
const tx = await contract.connect(deployer).mint(alice.address, 1000);
const receipt = await tx.wait();
console.log("Success:", receipt.status === 1);
```

### Call Function (Read-Only)

```javascript
const result = await contract.totalSupply();
console.log("Supply:", result.toString());
```

### Decrypt Balance (FHEVM)

```javascript
const balance = await contract.balanceOf(alice.address);
const decrypted = await hre.fhevm.userDecryptEuint(
  hre.fhevm.FhevmType.euint32,
  balance,
  contractAddress,
  alice
);
console.log("Decrypted:", decrypted);
```

---

## 📚 Full Example

```typescript
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting interaction...\n");

  // Setup
  const [deployer, alice, bob] = await ethers.getSigners();
  console.log("Accounts:");
  console.log("  Deployer:", deployer.address);
  console.log("  Alice:", alice.address);
  console.log("  Bob:", bob.address);

  // Deploy
  console.log("\n📦 Deploying...");
  const factory = await ethers.getContractFactory("ConfidentialERC20");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("✅ Deployed at:", address);

  // Mint
  console.log("\n🪙 Minting...");
  await contract.connect(deployer).mint(alice.address, 1000);
  await contract.connect(deployer).mint(bob.address, 500);
  console.log("✅ Minted");

  // Check supply
  console.log("\n📊 Supply:", (await contract.totalSupply()).toString());

  // Transfer
  console.log("\n➡️  Transferring 100 from Alice to Bob...");
  const tx = await contract.connect(alice).transfer(bob.address, 100);
  await tx.wait();
  console.log("✅ Transferred");

  console.log("\n✨ Done!");
}

main().catch(console.error);
```

---

## 🎓 All Commands

```bash
npm run compile              # Compile contracts
npm run test                 # Run tests
npx hardhat node             # Start local node
npx hardhat console          # Open console
npx hardhat run <script>     # Run script
npm run deploy:localhost     # Deploy locally
npm run deploy:sepolia       # Deploy to testnet
```

---

## ✨ No Errors, Full Control!

Terminal interaction gives you:
- ✅ No frontend errors
- ✅ No wallet popups
- ✅ Direct contract access
- ✅ Full debugging
- ✅ Automation-friendly

**Frontend is optional - skip it if you don't need UI!**
