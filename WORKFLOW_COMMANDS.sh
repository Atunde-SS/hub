#!/bin/bash
# Quick-Interact Sepolia Workflow - Copy/Paste Ready Commands

# This file shows the exact commands users need to deploy and interact with their
# contracts on Sepolia testnet using the auto-detect quick-interact scripts.

# ============================================================================
# SETUP: One-time configuration
# ============================================================================

# 1. Clone and setup Hub
git clone <your-repo-url>
cd Hub
npm install
git submodule update --init --recursive

# 2. Generate your first FHEVM project
npx ts-node scripts/create-fhevm-example.ts confidential-erc20 my-fhevm-project
cd my-fhevm-project
npm install

# 3. Configure environment variables
cp .env.example .env
# ⚠️ IMPORTANT: Edit .env with your actual values:
# MNEMONIC="your twelve word recovery phrase"
# INFURA_API_KEY="your-infura-project-id"

# ============================================================================
# LOCALHOST (Development) - Fastest iteration
# ============================================================================

echo "LOCALHOST WORKFLOW:"
echo "==================="

# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Run quick-interact on localhost
npx hardhat run scripts/quick-interact.ts --network localhost

# Output:
# 📦 Deploying ConfidentialERC20...
#    ✅ Deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

# Run again - script reuses the same deployment:
npx hardhat run scripts/quick-interact.ts --network localhost

# Output:
# 📦 Contract Status:
#    ✅ Using existing deployment at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

# Reset and deploy fresh (if needed):
rm -rf deployments/localhost
npx hardhat run scripts/quick-interact.ts --network localhost

# ============================================================================
# SEPOLIA TESTNET (Real blockchain)
# ============================================================================

echo -e "\nSEPOLIA WORKFLOW:"
echo "================="

# Step 1: Compile contracts
npm run compile

# Step 2: Deploy to Sepolia
# ⚠️ Make sure you have test ETH first!
# Get from: https://sepoliafaucet.com/
npm run deploy:sepolia

#or 

npx hardhat deploy --network sepolia

# Output:
# deploying "ConfidentialERC20"
# ...
# ✅ deployed at 0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e with tx 0xabc123...

# Step 3: Run quick-interact on Sepolia (auto-detects deployed address!)
npx hardhat run scripts/quick-interact.ts --network sepolia

# Output:
# 📦 Contract Status:
#    ✅ Using existing deployment at: 0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e
#    🌐 Network: sepolia
#
# 🎯 Calling Contract Functions:
# [Transaction results from REAL Sepolia blockchain...]
#
# 📌 Contract Address (save for frontend):
#    0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e
#
# 📖 Next Steps:
#    1. Verify on Etherscan: https://sepolia.etherscan.io/address/0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e
#    2. Use in frontend: Set NEXT_PUBLIC_CONTRACT_ADDRESS=0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e

# Step 4: Verify on Etherscan
# Open in browser: https://sepolia.etherscan.io/address/0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e

# Run again - script reuses the same contract:
npx hardhat run scripts/quick-interact.ts --network sepolia

# ============================================================================
# COMPARING NETWORKS
# ============================================================================

echo -e "\nCOMPARE NETWORKS:"
echo "================="

# Check what's deployed on each network:
echo "Localhost deployments:"
ls -la deployments/localhost/

echo -e "\nSepolia deployments:"
ls -la deployments/sepolia/

# View specific contract addresses:
echo -e "\nLocalhost address:"
cat deployments/localhost/ConfidentialERC20.json | jq '.address'

echo -e "\nSepolia address:"
cat deployments/sepolia/ConfidentialERC20.json | jq '.address'

# ============================================================================
# RESET & CLEAN
# ============================================================================

echo -e "\nCLEAN UP:"
echo "========="

# Reset localhost deployments (start fresh)
rm -rf deployments/localhost
echo "Localhost deployments cleared"

# Reset Sepolia deployments (be careful - real chain!)
# ⚠️ Warning: Only do this if you want to redeploy to Sepolia
# rm -rf deployments/sepolia
# echo "Sepolia deployments cleared"

# ============================================================================
# ADVANCED: CUSTOM INTERACTIONS
# ============================================================================

echo -e "\nCUSTOMIZATION:"
echo "=============="

# The generated scripts are fully editable
# Edit your interactions here:
nano scripts/quick-interact.ts

# Example customizations:
# 1. Pass parameters to functions
# 2. Check state before/after
# 3. Create custom workflows
# 4. Handle FHE-specific inputs
# 5. Verify contract behavior

# Then run again with your customizations:
npx hardhat run scripts/quick-interact.ts --network localhost
npx hardhat run scripts/quick-interact.ts --network sepolia

# ============================================================================
# INTEGRATION WITH FRONTEND
# ============================================================================

echo -e "\nFRONTEND INTEGRATION:"
echo "====================="

# After deploying and running quick-interact:

# 1. Copy the contract address from output
#    Example: 0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e

# 2. Go to frontend directory
cd ../frontend  # if generated with --frontend

# 3. Sync ABI (auto-detection like quick-interact!)
npm run sync-abi

# 4. Update environment
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0xAb5801a77D01b1a55a0BdFfF1e99Bac96C8f3D5e" >> .env.local

# 5. Start frontend
npm run dev

# Open: http://localhost:3000

# ============================================================================
# TROUBLESHOOTING
# ============================================================================

echo -e "\nTROUBLESHOOTING:"
echo "================"

# Problem: "Cannot connect to localhost:8545"
# Solution: Make sure "npx hardhat node" is running in Terminal 1

# Problem: "No such file or directory .env"
# Solution: cp .env.example .env && nano .env

# Problem: "Insufficient balance" on Sepolia
# Solution: Get test ETH from https://sepoliafaucet.com/

# Problem: "Transaction reverted"
# Solution: Edit scripts/quick-interact.ts to fix parameters

# Problem: "Cannot find module @fhevm/contracts"
# Solution: npm install && npm run compile

# ============================================================================
# NEXT STEPS
# ============================================================================

echo -e "\nNEXT STEPS:"
echo "==========="

echo "1. Generate projects for other contracts:"
echo "   npx ts-node scripts/create-fhevm-example.ts fhe-counter my-counter"
echo "   npx ts-node scripts/create-fhevm-example.ts blind-auction my-auction"
echo ""
echo "2. Deploy to Sepolia:"
echo "   npm run deploy:sepolia"
echo ""
echo "3. Interact with deployed contracts:"
echo "   npx hardhat run scripts/quick-interact.ts --network sepolia"
echo ""
echo "4. Use addresses in frontend:"
echo "   npm run sync-abi && npm run dev"
echo ""
echo "5. Customize scripts for your needs:"
echo "   nano scripts/quick-interact.ts"

# ============================================================================
# KEY POINTS TO REMEMBER
# ============================================================================

echo -e "\nKEY POINTS:"
echo "==========="
echo ""
echo "✅ Scripts auto-detect deployed contracts"
echo "✅ No manual address copying needed"
echo "✅ Real blockchain interaction (not mocked)"
echo "✅ Works on localhost, Sepolia, and custom networks"
echo "✅ Saves gas by reusing deployments"
echo "✅ Fully customizable for your needs"
echo "✅ Same pattern as frontend's sync-abi"
echo ""

# ============================================================================
