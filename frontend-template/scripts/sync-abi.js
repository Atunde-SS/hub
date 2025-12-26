const fs = require('fs');
const path = require('path');

/**
 * sync-abi.js
 * Automatically locates the compiled contract artifact and copies the ABI to the frontend lib folder.
 */

const ROOT_DIR = path.join(__dirname, '..', '..');
const CONTRACTS_DIR = path.join(ROOT_DIR, 'contracts');
const ARTIFACTS_DIR = path.join(ROOT_DIR, 'artifacts', 'contracts');
const DEST_PATH = path.join(__dirname, '..', 'lib', 'contract-abi.json');

function findFirstJson(startPath) {
    if (!fs.existsSync(startPath)) return null;
    const files = fs.readdirSync(startPath);
    for (const file of files) {
        const filename = path.join(startPath, file);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            const found = findFirstJson(filename);
            if (found) return found;
        } else if (file.endsWith('.json') && !file.endsWith('.dbg.json')) {
            return filename;
        }
    }
    return null;
}

try {
    console.log('🔍 Locating contract artifacts...');
    const artifactPath = findFirstJson(ARTIFACTS_DIR);

    if (!artifactPath) {
        console.error('❌ Could not find any contract artifacts in artifacts/contracts/. Did you run `npm run compile`?');
        process.exit(1);
    }

    console.log(`📄 Found artifact: ${path.basename(artifactPath)}`);
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    if (!artifact.abi) {
        console.error('❌ Artifact does not contain an ABI field.');
        process.exit(1);
    }

    // Ensure lib exists
    const libDir = path.dirname(DEST_PATH);
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
    }

    fs.writeFileSync(DEST_PATH, JSON.stringify(artifact.abi, null, 2));
    console.log(`✅ ABI successfully synced to: ${path.relative(ROOT_DIR, DEST_PATH)}`);

} catch (err) {
    console.error(`❌ Sync failed: ${err.message}`);
    process.exit(1);
}
