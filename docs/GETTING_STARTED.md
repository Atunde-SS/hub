# Getting Started with FHEVM Example Hub

Welcome! This guide will help you get started with privacy-preserving smart contracts using Fully Homomorphic Encryption (FHE).

## 📚 Table of Contents

1. [What is FHEVM?](#what-is-fhevm)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Your First Example](#your-first-example)
5. [Understanding the Code](#understanding-the-code)
6. [Next Steps](#next-steps)

---

## What is FHEVM?

**FHEVM** (Fully Homomorphic Encryption Virtual Machine) is a technology that allows you to perform computations on **encrypted data** without ever decrypting it.

### Why This Matters

Traditional smart contracts are **completely transparent**:

- ❌ Everyone can see all transaction data
- ❌ No privacy for users
- ❌ Sensitive information exposed

FHEVM changes this:

- ✅ Data stays encrypted on-chain
- ✅ Computations work on encrypted values
- ✅ Only authorized parties can decrypt results
- ✅ Build truly private applications

### Real-World Use Cases

- **🗳️ Private Voting:** Vote without revealing your choice
- **🎯 Sealed Auctions:** Bid without showing your amount
- **💰 Confidential DeFi:** Trade without exposing balances
- **🎮 Hidden Information Games:** Play with secret game state
- **🏥 Private Medical Records:** Store sensitive data on-chain

---

## Prerequisites

### Required Knowledge

- **Solidity Basics:** You should understand smart contract development
- **Hardhat Experience:** Familiarity with Hardhat is helpful
- **JavaScript/TypeScript:** For tests and scripts

### System Requirements

- **Node.js** v20 or higher
- **npm** v9 or higher
- **Git** for cloning repositories

### Verify Your Setup

\`\`\`bash
node --version # Should be v20+
npm --version # Should be v9+
\`\`\`

---

## Installation

### Step 1: Clone the Repository

\`\`\`bash
git clone <your-repo-url>
cd fhevm-example-hub
\`\`\`

### Step 2: Install Dependencies

\`\`\`bash

# Install root dependencies

npm install

# Install base template dependencies

cd base-template
npm install
cd ..
\`\`\`

### Step 3: Verify Installation

\`\`\`bash

# This should show available commands

npm run help
\`\`\`

---

## Your First Example

Let's create your first confidential smart contract!

### Step 1: Generate Example Project

\`\`\`bash

# Create an FHE counter example

npm run create-example fhe-counter ./my-first-fhe-project
\`\`\`

This creates a complete Hardhat project with:

- ✅ FHE-enabled smart contract
- ✅ Comprehensive tests
- ✅ Deployment scripts
- ✅ All configuration files

### Step 2: Navigate to Your Project

\`\`\`bash
cd my-first-fhe-project
\`\`\`

### Step 3: Install Project Dependencies

\`\`\`bash
npm install
\`\`\`

### Step 4: Compile the Contract

\`\`\`bash
npm run compile
\`\`\`

You should see:
\`\`\`
Compiled 1 Solidity file successfully
\`\`\`

### Step 5: Run the Tests

\`\`\`bash
npm run test
\`\`\`

You'll see tests passing with encrypted operations! 🎉

---

## Understanding the Code

Let's break down what's happening in the FHE Counter example.

### The Smart Contract

\`\`\`solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract FHECounter is ZamaEthereumConfig {
// Encrypted counter - nobody can see the value!
euint32 private \_count;

    function increment(externalEuint32 inputValue, bytes calldata inputProof) external {
        // 1. Verify and convert encrypted input
        euint32 value = FHE.fromExternal(inputValue, inputProof);

        // 2. Perform encrypted addition
        _count = FHE.add(_count, value);

        // 3. Grant permissions (CRITICAL!)
        FHE.allowThis(_count);        // Contract can use it
        FHE.allow(_count, msg.sender); // User can decrypt it
    }

}
\`\`\`

### Key Concepts Explained

#### 1. Encrypted Types

\`\`\`solidity
euint32 private \_count; // Encrypted unsigned 32-bit integer
\`\`\`

- **euint32** is like **uint32**, but encrypted
- Values are encrypted on-chain
- Only authorized parties can decrypt

#### 2. Input Proofs

\`\`\`solidity
function increment(externalEuint32 inputValue, bytes calldata inputProof)
\`\`\`

- **externalEuint32**: Encrypted input from user
- **inputProof**: Cryptographic proof that encryption is valid
- Prevents fake or malicious encrypted inputs

#### 3. FHE Operations

\`\`\`solidity
\_count = FHE.add(\_count, value);
\`\`\`

- **FHE.add()**: Addition on encrypted data
- Works without decrypting
- Result is also encrypted

#### 4. Access Control (Most Important!)

\`\`\`solidity
FHE.allowThis(\_count); // Contract permission
FHE.allow(\_count, msg.sender); // User permission
\`\`\`

- **FHE.allowThis()**: Lets contract access value in future transactions
- **FHE.allow()**: Lets specific address decrypt the value
- **Forgetting these = Most common bug!**

### The Test File

\`\`\`typescript
it("should increment counter by encrypted value", async function () {
// 1. Encrypt a value client-side
const clearValue = 5;
const encryptedInput = await fhevm
.createEncryptedInput(contractAddress, alice.address)
.add32(clearValue)
.encrypt();

    // 2. Submit encrypted value to contract
    await contract
        .connect(alice)
        .increment(encryptedInput.handles[0], encryptedInput.inputProof);

    // 3. Get encrypted result
    const encryptedCount = await contract.getCount();

    // 4. Decrypt client-side
    const decryptedCount = await fhevm.userDecryptEuint(
        FhevmType.euint32,
        encryptedCount,
        contractAddress,
        alice
    );

    expect(decryptedCount).to.eq(clearValue);

});
\`\`\`

### Workflow Summary

```
1. USER (Client-side)
   ↓ Encrypts value: 5 → [encrypted]
   ↓ Sends: [encrypted] + proof

2. CONTRACT
   ↓ Verifies proof
   ↓ Performs: _count = FHE.add(_count, [encrypted])
   ↓ Grants permissions
   ↓ Returns: [encrypted result]

3. USER (Client-side)
   ↓ Receives: [encrypted result]
   ↓ Decrypts: [encrypted] → 5
   ✓ Success!
```

---

## Next Steps

### 🎓 Learning Path

1. **Completed:** FHE Counter (Basic operations)
2. **Next:** Try `encrypt-single-value` (Understand encryption binding)
3. **Then:** `access-control-basics` (Master permission system)
4. **After:** `fhe-comparison` (Encrypted comparisons)
5. **Finally:** `blind-auction` (Real-world application)

### 📖 Explore More Examples

\`\`\`bash

# List all available examples

npm run list-examples

# Generate different examples

npm run create-example encrypt-single-value ./encryption-example
npm run create-example access-control-basics ./permissions-example
npm run create-example blind-auction ./auction-example
\`\`\`

### 🔍 Deep Dive into Concepts

Read these guides to understand FHEVM deeply:

- **[CONCEPTS.md](CONCEPTS.md)** - Core FHE concepts explained
- **[BEST_PRACTICES.md](BEST_PRACTICES.md)** - Development guidelines
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues & solutions

### 💻 Build Your Own

Once you're comfortable, build your own confidential application:

1. Design your use case
2. Identify what data needs encryption
3. Use examples as templates
4. Test thoroughly
5. Deploy!

### 🤝 Get Help

- **Discord:** [Zama Discord](https://discord.com/invite/zama)
- **Forum:** [Community Forum](https://community.zama.ai)
- **Docs:** [Official Documentation](https://docs.zama.ai/fhevm)
- **GitHub Issues:** Report bugs or ask questions

---

## 🎉 Congratulations!

You've completed the Getting Started guide! You now know:

- ✅ What FHEVM is and why it matters
- ✅ How to generate example projects
- ✅ Basic structure of FHE smart contracts
- ✅ How to test encrypted operations
- ✅ Key concepts: encrypted types, proofs, permissions

**You're ready to build privacy-preserving smart contracts!** 🚀

---

## 📚 Quick Reference

### Common Commands

\`\`\`bash

# Generate example

npm run create-example <name> <path>

# List all examples

npm run list-examples

# Generate documentation

npm run generate-docs <example-name>

# In example project:

npm install # Install dependencies
npm run compile # Compile contracts
npm run test # Run tests
npm run deploy:local # Deploy to local network
\`\`\`

### Key FHE Operations

\`\`\`solidity
// Arithmetic
FHE.add(a, b) FHE.sub(a, b) FHE.mul(a, b)

// Comparison
FHE.eq(a, b) FHE.ne(a, b)
FHE.gt(a, b) FHE.lt(a, b)

// Bitwise
FHE.and(a, b) FHE.or(a, b) FHE.xor(a, b)

// Conditional
FHE.select(condition, ifTrue, ifFalse)

// Permissions
FHE.allowThis(value) // Contract permission
FHE.allow(value, address) // User permission
FHE.allowTransient(value) // Temporary permission
\`\`\`

### Encrypted Types

\`\`\`solidity
euint8, euint16, euint32, euint64, euint128, euint256 // Unsigned integers
ebool // Boolean
eaddress // Address
\`\`\`

---

Happy coding with FHEVM! 🔐✨
