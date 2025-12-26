import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { EXAMPLES_MAP } from './config/examples';
import { generateAndWriteQuickInteract, listContractFunctions, generateFunctionsSummary } from './utils/quick-interact-generator';

// Color codes for terminal output
enum Color {
  Reset = '\x1b[0m',
  Green = '\x1b[32m',
  Blue = '\x1b[34m',
  Yellow = '\x1b[33m',
  Red = '\x1b[31m',
  Cyan = '\x1b[36m',
}

function log(message: string, color: Color = Color.Reset): void {
  console.log(`${color}${message}${Color.Reset}`);
}

function error(message: string): never {
  log(`❌ Error: ${message}`, Color.Red);
  process.exit(1);
}

function success(message: string): void {
  log(`✅ ${message}`, Color.Green);
}

function info(message: string): void {
  log(`ℹ️  ${message}`, Color.Blue);
}

function copyDirectoryRecursive(source: string, destination: string): void {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const items = fs.readdirSync(source);

  items.forEach(item => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      // Skip node_modules, artifacts, cache, etc.
      if (['node_modules', 'artifacts', 'cache', 'coverage', 'types', 'dist'].includes(item)) {
        return;
      }
      copyDirectoryRecursive(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

function getContractName(contractPath: string): string | null {
  const content = fs.readFileSync(contractPath, 'utf-8');
  // Match contract declaration, ignoring comments and ensuring it's followed by 'is' or '{'
  const match = content.match(/^\s*contract\s+(\w+)(?:\s+is\s+|\s*\{)/m);
  return match ? match[1] : null;
}

function updateDeployScript(outputDir: string, contractName: string): void {
  const deployScriptPath = path.join(outputDir, 'deploy', 'deploy.ts');

  const deployScript = `import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployed${contractName} = await deploy("${contractName}", {
    from: deployer,
    log: true,
  });

  console.log(\`${contractName} contract: \`, deployed${contractName}.address);
};
export default func;
func.id = "deploy_${contractName.toLowerCase()}";
func.tags = ["${contractName}"];
`;

  fs.writeFileSync(deployScriptPath, deployScript);
}

function updatePackageJson(outputDir: string, exampleName: string, description: string): void {
  const packageJsonPath = path.join(outputDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.name = `fhevm-example-${exampleName}`;
  packageJson.description = description;
  packageJson.homepage = `https://github.com/zama-ai/fhevm-examples/${exampleName}`;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

function generateReadme(exampleName: string, description: string, contractName: string, useFrontend: boolean): string {
  const frontendSection = `
## Frontend (Optional)

This example includes an optional Next.js frontend template.

1. **Install frontend dependencies**
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. **Sync contract ABI**
   \`\`\`bash
   npm run sync-abi
   \`\`\`

3. **Configure and Run**
   Edit \`.env.local\` with your deployed contract address, then:
   \`\`\`bash
   npm run dev
   \`\`\`
`;

  return `# FHEVM Example: ${exampleName}

${description}

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Package manager

### Installation

1. **Install dependencies**

   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables**

   You can use the default mnemonic or set your own via Hardhat vars or \`.env\` file.
   The project is configured to use \`.env\` for simplicity.

   Copy \`.env.example\` to \`.env\` and update as needed.

3. **Compile and test**

   \`\`\`bash
   npm run compile
   npm run test
   \`\`\`
${useFrontend ? frontendSection : ''}
## Contract

The main contract is \`${contractName}\` located in \`contracts/${contractName}.sol\`.

## Interact Without Frontend

This example includes an **auto-generated quick-interact script** that lets you interact with the ${contractName} contract directly from the terminal - no frontend, no wallet extensions needed!

### Method 1: Quick Interact Script (Recommended)

Run the contract with all functions demonstrated:

\`\`\`bash
# Start local blockchain
npx hardhat node

# In another terminal, run the script
npx hardhat run scripts/quick-interact.ts --network localhost
\`\`\`

**Output**: You'll see deployment, function calls, and results all in the terminal.

### Method 2: Hardhat Console

For interactive exploration:

\`\`\`bash
npx hardhat console --network localhost

> const contract = await ethers.getContractAt('${contractName}', '<deployed-address>')
> // Call any function
\`\`\`

### Method 3: Run Tests

Tests demonstrate contract functionality:

\`\`\`bash
npm run test
\`\`\`

## Testing

Run the test suite:

\`\`\`bash
npm run test
\`\`\`

For Sepolia testnet testing:

\`\`\`bash
npm run test:sepolia
\`\`\`

## Deployment

Deploy to local network:

\`\`\`bash
npx hardhat node
npx hardhat deploy --network localhost
\`\`\`

Deploy to Sepolia:

\`\`\`bash
npx hardhat deploy --network sepolia
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
\`\`\`

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Examples](https://docs.zama.org/protocol/examples)
- [FHEVM Hardhat Plugin](https://docs.zama.ai/protocol/solidity-guides/development-guide/hardhat)

## License

This project is licensed under the BSD-3-Clause-Clear License.

---

**Built with ❤️ using [FHEVM](https://github.com/zama-ai/fhevm) by Zama**
`;
}

function createExample(exampleName: string, outputDir: string, useFrontend: boolean = false): void {
  const rootDir = path.resolve(__dirname, '..');
  const templateDir = path.join(rootDir, 'fhevm-hardhat-template');

  // Check if example exists
  if (!EXAMPLES_MAP[exampleName]) {
    error(`Unknown example: ${exampleName}\n\nAvailable examples:\n${Object.keys(EXAMPLES_MAP).map(k => `  - ${k}`).join('\n')}`);
  }

  const example = EXAMPLES_MAP[exampleName];
  const contractPath = path.join(rootDir, example.contract);
  const testPath = path.join(rootDir, example.test);

  // Validate paths exist
  if (!fs.existsSync(contractPath)) {
    error(`Contract not found: ${example.contract}`);
  }
  if (!fs.existsSync(testPath)) {
    error(`Test not found: ${example.test}`);
  }

  info(`Creating FHEVM example: ${exampleName}`);
  info(`Output directory: ${outputDir}`);
  if (useFrontend) info('Frontend template will be included');

  // Step 1: Copy template
  log('\n📋 Step 1: Copying template...', Color.Cyan);
  if (fs.existsSync(outputDir)) {
    error(`Output directory already exists: ${outputDir}`);
  }
  copyDirectoryRecursive(templateDir, outputDir);
  success('Template copied');

  // Step 2: Copy contract
  log('\n📄 Step 2: Copying contract...', Color.Cyan);
  const contractName = getContractName(contractPath);
  if (!contractName) {
    error('Could not extract contract name from contract file');
  }
  const destContractPath = path.join(outputDir, 'contracts', `${contractName}.sol`);

  // Remove template contract
  const templateContract = path.join(outputDir, 'contracts', 'FHECounter.sol');
  if (fs.existsSync(templateContract)) {
    fs.unlinkSync(templateContract);
  }

  fs.copyFileSync(contractPath, destContractPath);
  success(`Contract copied: ${contractName}.sol`);

  // Step 3: Copy test
  log('\n🧪 Step 3: Copying test...', Color.Cyan);
  const destTestPath = path.join(outputDir, 'test', path.basename(testPath));

  // Remove template tests
  const testDir = path.join(outputDir, 'test');
  fs.readdirSync(testDir).forEach(file => {
    if (file.endsWith('.ts')) {
      fs.unlinkSync(path.join(testDir, file));
    }
  });

  fs.copyFileSync(testPath, destTestPath);
  success(`Test copied: ${path.basename(testPath)}`);

  // Step 4: Update configuration files
  log('\n⚙️  Step 4: Updating configuration...', Color.Cyan);
  updateDeployScript(outputDir, contractName);
  updatePackageJson(outputDir, exampleName, example.description);
  success('Configuration updated');

  // Step 5: Generate quick-interact script
  log('\n🎬 Step 5: Generating quick-interact script...', Color.Cyan);
  try {
    const quickInteractPath = path.join(outputDir, 'scripts', 'quick-interact.ts');
    const scriptsDir = path.dirname(quickInteractPath);
    if (!fs.existsSync(scriptsDir)) {
      fs.mkdirSync(scriptsDir, { recursive: true });
    }
    generateAndWriteQuickInteract(destContractPath, quickInteractPath);
    success(`Quick-interact script generated: scripts/quick-interact.ts`);
    success(`Run with: npx hardhat run scripts/quick-interact.ts --network localhost`);
  } catch (err) {
    log(`⚠️  Could not generate quick-interact script: ${(err as Error).message}`, Color.Yellow);
  }

  // Step 6: Copy Frontend (Optional)
  if (useFrontend) {
    log('\n🎨 Step 6: Copying frontend template...', Color.Cyan);
    const frontendSource = path.join(rootDir, 'frontend-template');
    const frontendDest = path.join(outputDir, 'frontend');
    
    // Copy frontend
    copyDirectoryRecursive(frontendSource, frontendDest);
    
    // Create .env.local for frontend
    const envLocal = `NEXT_PUBLIC_CONTRACT_ADDRESS=""\n`;
    fs.writeFileSync(path.join(frontendDest, '.env.local'), envLocal);
    
    success('Frontend template copied to /frontend');
  }

  // Step 7: Generate README
  log(`\n📝 Step ${useFrontend ? '7' : '6'}: Generating README...`, Color.Cyan);
  const readme = generateReadme(exampleName, example.description, contractName, useFrontend);
  fs.writeFileSync(path.join(outputDir, 'README.md'), readme);
  success('README.md generated');

  // Final summary
  log('\n' + '='.repeat(60), Color.Green);
  success(`FHEVM example "${exampleName}" created successfully!`);
  log('='.repeat(60), Color.Green);

  log('\n📦 Next steps:', Color.Yellow);
  log(`  cd ${path.relative(process.cwd(), outputDir)}`);
  log('  npm install');
  log('  npm run compile');
  log('  npm run test');
  log('  npx hardhat node &');
  log('  npx hardhat run scripts/quick-interact.ts --network localhost');
  if (useFrontend) {
    log('  cd frontend && npm install && npm run sync-abi && npm run dev');
  }

  log('\n🎉 Happy coding with FHEVM!', Color.Cyan);
}

// Main execution
function main(): void {
  const args = process.argv.slice(2);
  const useFrontend = args.includes('--frontend');
  const cleanArgs = args.filter(a => a !== '--frontend');

  if (cleanArgs.length === 0 || cleanArgs[0] === '--help' || cleanArgs[0] === '-h') {
    log('FHEVM Example Generator', Color.Cyan);
    log('\nUsage: ts-node scripts/create-fhevm-example.ts <example-name> [output-dir] [--frontend]\n');
    log('Available examples:', Color.Yellow);
    Object.entries(EXAMPLES_MAP).forEach(([name, info]) => {
      log(`  ${name}`, Color.Green);
      log(`    ${info.description}`, Color.Reset);
    });
    log('\nExample:', Color.Yellow);
    log('  ts-node scripts/create-fhevm-example.ts fhe-counter ./my-fhe-counter --frontend\n');
    process.exit(0);
  }

  const exampleName = cleanArgs[0];
  const outputDir = cleanArgs[1] || path.join(process.cwd(), 'output', `fhevm-example-${exampleName}`);

  createExample(exampleName, outputDir, useFrontend);
}

main();
