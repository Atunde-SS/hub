/**
 * Quick Interact Script Generator
 * 
 * Automatically generates contract-specific quick-interact.ts scripts
 * that demonstrate all the functions of a given contract.
 * 
 * Features:
 * - Auto-detects deployed contract addresses from hardhat-deploy artifacts
 * - Works with localhost, Sepolia, and any configured network
 * - Real blockchain interaction (not mocks)
 * - Syncs automatically like frontend's sync-abi
 */

import * as fs from 'fs';
import * as path from 'path';

interface FunctionInfo {
  name: string;
  params: string[];
  isPayable: boolean;
  isViewOrPure: boolean;
}

/**
 * Extract function signatures from Solidity contract
 */
function extractFunctions(contractContent: string): FunctionInfo[] {
  const functions: FunctionInfo[] = [];
  
  // Match function declarations, excluding constructors and internal functions
  // Pattern: function name(params) [visibility] [modifiers] [returns]
  const functionRegex = /function\s+(\w+)\s*\(([^)]*)\)\s*([^{]*)\{/gm;
  
  let match;
  while ((match = functionRegex.exec(contractContent)) !== null) {
    const [, name, params, modifiers] = match;
    
    // Skip internal, private, or constructor
    if (name === 'constructor' || modifiers.includes('internal') || modifiers.includes('private')) {
      continue;
    }
    
    // Parse parameters
    const paramList = params
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0)
      .map(p => {
        const parts = p.split(/\s+/);
        return parts[parts.length - 1]; // Get the parameter name
      });
    
    const isPayable = modifiers.includes('payable');
    const isViewOrPure = modifiers.includes('view') || modifiers.includes('pure');
    
    functions.push({
      name,
      params: paramList,
      isPayable,
      isViewOrPure,
    });
  }
  
  return functions;
}

/**
 * Get the contract name from Solidity file
 */
function getContractName(contractContent: string): string | null {
  const match = contractContent.match(/contract\s+(\w+)(?:\s+is\s+|\s*\{)/);
  return match ? match[1] : null;
}

/**
 * Generate example interaction code for a function
 */
function generateFunctionInteraction(func: FunctionInfo, index: number, contractVar: string): string {
  const step = index + 1;
  
  if (func.isViewOrPure) {
    // For view/pure functions, just call and log result
    return `  // ${step}. ${func.name}() - View/Pure function
  console.log("\\n${step}️⃣  Calling ${func.name}()...");
  try {
    const result = await ${contractVar}.${func.name}();
    console.log(\`   📊 Result: \${result.toString()}\`);
  } catch (error) {
    console.log(\`   ℹ️  Skipped (requires parameters or specific setup)\`);
  }`;
  } else {
    // For state-changing functions, execute transaction
    return `  // ${step}. ${func.name}() - State-changing function
  console.log("\\n${step}️⃣  Calling ${func.name}()...");
  try {
    const tx = await ${contractVar}.${func.name}();
    const receipt = await tx.wait();
    console.log(\`   ✅ Success (Gas: \${receipt?.gasUsed})\`);
  } catch (error) {
    console.log(\`   ⚠️  Skipped (requires parameters or specific setup)\`);
  }`;
  }
}

/**
 * Generate a complete quick-interact.ts script for a contract
 */
export function generateQuickInteractScript(
  contractName: string,
  contractPath: string,
): string {
  const contractContent = fs.readFileSync(contractPath, 'utf-8');
  const actualContractName = getContractName(contractContent);
  
  if (!actualContractName) {
    throw new Error(`Could not extract contract name from ${contractPath}`);
  }
  
  const functions = extractFunctions(contractContent);
  const contractVar = 'contract';
  
  // Generate function interactions
  const functionInteractions = functions
    .map((func, index) => generateFunctionInteraction(func, index, contractVar))
    .join('\n\n');
  
  const functionsListStr = functions
    .map(f => `   - ${f.name}(${f.params.join(', ')})`)
    .join('\n');
  
  return `#!/usr/bin/env node
/**
 * ${actualContractName} - Quick Interaction Script
 * 
 * Auto-generated script for interacting with ${actualContractName} contract.
 * This script demonstrates all the main functions without requiring frontend or wallet extensions.
 * 
 * Run with local network:
 *   npx hardhat node
 *   npx hardhat run scripts/quick-interact.ts --network localhost
 * 
 * Run with Sepolia testnet:
 *   npx hardhat run scripts/quick-interact.ts --network sepolia
 * 
 * Available contract functions:
${functionsListStr}
 */

import { ethers } from "hardhat";
import hre from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 ${actualContractName} - Contract Interaction (Terminal Only)\\n");

  // ================================================================
  // SETUP: Get accounts
  // ================================================================
  const [deployer, alice, bob, charlie] = await ethers.getSigners();

  console.log("📋 Accounts:");
  console.log(\`   Deployer: \${deployer.address}\`);
  console.log(\`   Alice:    \${alice.address}\`);
  console.log(\`   Bob:      \${bob.address}\`);
  console.log(\`   Charlie:  \${charlie.address}\`);

  // ================================================================
  // DETECT: Auto-detect deployed contract address
  // ================================================================
  const networkName = (await ethers.provider.getNetwork()).name;
  const deploymentsDir = path.join(__dirname, "..", "deployments", networkName);
  const deploymentFile = path.join(deploymentsDir, "${actualContractName}.json");
  
  let contractAddress: string;
  let ${contractVar};
  
  if (fs.existsSync(deploymentFile)) {
    // ✅ Found existing deployment - use it
    const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf-8"));
    contractAddress = deployment.address;
    
    console.log("\\n📦 Contract Status:");
    console.log(\`   ✅ Using existing deployment at: \${contractAddress}\`);
    console.log(\`   🌐 Network: \${networkName}\`);
    
    const factory = await ethers.getContractFactory("${actualContractName}");
    ${contractVar} = factory.attach(contractAddress);
  } else {
    // ⚠️ No deployment found - deploy fresh
    console.log("\\n📦 Deploying ${actualContractName}...");

    const factory = await ethers.getContractFactory("${actualContractName}");
    ${contractVar} = await factory.deploy();
    await ${contractVar}.waitForDeployment();
    contractAddress = await ${contractVar}.getAddress();

    console.log(\`   ✅ Deployed at: \${contractAddress}\`);
    console.log(\`   🌐 Network: \${networkName}\`);
  }
  
  console.log(\`   ℹ️  Contract Address: \${contractAddress}\`);

  // ================================================================
  // INTERACT: Call contract functions
  // ================================================================
  console.log("\\n🎯 Calling Contract Functions:\\n");

${functionInteractions}

  // ================================================================
  // SUMMARY
  // ================================================================
  console.log("\\n" + "=".repeat(60));
  console.log("✨ Contract interaction complete!");
  console.log("=".repeat(60));
  
  console.log(\`\\n📌 Contract Address (save for frontend):\\n   \${contractAddress}\\n\`);
  console.log("📖 Next Steps:");
  console.log(\`   1. Verify on Etherscan: https://\${networkName === "sepolia" ? "sepolia." : ""}etherscan.io/address/\${contractAddress}\`);
  console.log(\`   2. Use in frontend: Set NEXT_PUBLIC_CONTRACT_ADDRESS=\${contractAddress}\`);
  console.log("   3. Run again to test more interactions!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\\n❌ Error:", error.message);
    process.exit(1);
  });
`;
}

/**
 * Generate a quick-interact script and write it to disk
 */
export function generateAndWriteQuickInteract(
  contractPath: string,
  outputScriptPath: string,
): void {
  const script = generateQuickInteractScript(
    path.basename(contractPath, '.sol'),
    contractPath,
  );
  
  fs.writeFileSync(outputScriptPath, script);
  
  // Make executable on Unix systems
  if (process.platform !== 'win32') {
    fs.chmodSync(outputScriptPath, '755');
  }
}

/**
 * List all functions in a contract (for documentation)
 */
export function listContractFunctions(contractPath: string): FunctionInfo[] {
  const contractContent = fs.readFileSync(contractPath, 'utf-8');
  return extractFunctions(contractContent);
}

/**
 * Generate a summary document of contract functions
 */
export function generateFunctionsSummary(
  contractName: string,
  functions: FunctionInfo[],
): string {
  if (functions.length === 0) {
    return `# ${contractName} - Contract Functions\n\nNo public functions found.\n`;
  }
  
  const functionsDoc = functions
    .map(func => {
      const type = func.isViewOrPure ? '(View/Pure)' : '(State-Changing)';
      const params = func.params.length > 0 ? `\n  - Parameters: ${func.params.join(', ')}` : '';
      const payable = func.isPayable ? '\n  - 💰 Payable: true' : '';
      return `### ${func.name}() ${type}${params}${payable}`;
    })
    .join('\n\n');
  
  const summary = `# ${contractName} - Contract Functions

## Overview

Total public functions: ${functions.length}

## Functions

${functionsDoc}

## Quick Interact

Run the auto-generated quick-interact script:

\`\`\`bash
npx hardhat run scripts/quick-interact.ts --network localhost
\`\`\`

Or with Sepolia:

\`\`\`bash
npx hardhat run scripts/quick-interact.ts --network sepolia
\`\`\`
`;
  
  return summary;
}
