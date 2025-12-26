#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { EXAMPLES_MAP } from './config/examples';

interface DocSection {
  title: string;
  content: string;
}

/**
 * Extract documentation from contract file
 */
function extractContractDocs(contractPath: string): DocSection[] {
  const fullPath = path.join(process.cwd(), contractPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Contract not found: ${contractPath}`);
    return [];
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const sections: DocSection[] = [];

  // Extract contract title from @title tag
  const titleMatch = content.match(/@title\s+(.+)/);
  if (titleMatch) {
    sections.push({
      title: 'Overview',
      content: titleMatch[1].trim()
    });
  }

  // Extract notice/description
  const noticeMatch = content.match(/@notice\s+(.+)/);
  if (noticeMatch) {
    sections.push({
      title: 'Description',
      content: noticeMatch[1].trim()
    });
  }

  // Extract dev notes
  const devMatch = content.match(/@dev\s+(.+)/);
  if (devMatch) {
    sections.push({
      title: 'Technical Details',
      content: devMatch[1].trim()
    });
  }

  return sections;
}

/**
 * Extract key functions from contract
 */
function extractFunctions(contractPath: string): string[] {
  const fullPath = path.join(process.cwd(), contractPath);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const functions: string[] = [];

  // Match function declarations
  const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*(?:external|public)/g;
  let match;

  while ((match = functionRegex.exec(content)) !== null) {
    if (!match[1].startsWith('_')) { // Skip private/internal
      functions.push(match[1]);
    }
  }

  return functions;
}

/**
 * Generate README.md for an example
 */
function generateExampleReadme(exampleId: string): string {
  const example = EXAMPLES_MAP[exampleId];
  if (!example) {
    throw new Error(`Example not found: ${exampleId}`);
  }

  const contractDocs = extractContractDocs(example.contract);
  const functions = extractFunctions(example.contract);

  let readme = `# ${example.title}\n\n`;

  // Add description
  readme += `## Overview\n\n${example.description}\n\n`;

  // Add extracted documentation
  contractDocs.forEach(section => {
    if (section.title !== 'Overview') {
      readme += `## ${section.title}\n\n${section.content}\n\n`;
    }
  });

  // Add category and difficulty
  readme += `**Category**: ${example.category}  \n`;
  readme += `**Difficulty**: ${example.difficulty || 'Intermediate'}\n\n`;

  // Add key functions
  if (functions.length > 0) {
    readme += `## Key Functions\n\n`;
    functions.forEach(fn => {
      readme += `- \`${fn}()\`\n`;
    });
    readme += `\n`;
  }

  // Add file links
  readme += `## Files\n\n`;
  readme += `- **Contract**: [\`${path.basename(example.contract)}\`](${example.contract})\n`;
  readme += `- **Test**: [\`${path.basename(example.test)}\`](${example.test})\n\n`;

  // Add quick start
  readme += `## Quick Start\n\n`;
  readme += `\`\`\`bash\n`;
  readme += `# Compile contracts\n`;
  readme += `npx hardhat compile\n\n`;
  readme += `# Run tests\n`;
  readme += `npx hardhat test ${example.test}\n\n`;
  readme += `# Generate standalone project\n`;
  readme += `ts-node scripts/create-fhevm-example.ts ${exampleId} ./output/${exampleId}\n`;
  readme += `\`\`\`\n\n`;

  // Add related examples
  const relatedExamples = Object.entries(EXAMPLES_MAP)
    .filter(([id, ex]) => ex.category === example.category && id !== exampleId)
    .slice(0, 3);

  if (relatedExamples.length > 0) {
    readme += `## Related Examples\n\n`;
    relatedExamples.forEach(([id, ex]) => {
      readme += `- [${ex.title}](../${ex.category.toLowerCase().replace(/\s+/g, '-')}/${id}.md)\n`;
    });
    readme += `\n`;
  }

  // Add resources
  readme += `## Resources\n\n`;
  readme += `- [FHEVM Documentation](https://docs.zama.ai/fhevm)\n`;
  readme += `- [Hardhat Documentation](https://hardhat.org/docs)\n`;
  if (example.category === 'OpenZeppelin') {
    readme += `- [OpenZeppelin Confidential Contracts](https://github.com/OpenZeppelin/openzeppelin-confidential-contracts)\n`;
  }

  return readme;
}

/**
 * Generate all documentation
 */
function generateAllDocs() {
  console.log('📚 Generating Documentation...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const [exampleId, example] of Object.entries(EXAMPLES_MAP)) {
    try {
      const outputPath = path.join(process.cwd(), example.output);
      const outputDir = path.dirname(outputPath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Generate README
      const readme = generateExampleReadme(exampleId);
      fs.writeFileSync(outputPath, readme);

      console.log(`✅ Generated: ${example.output}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error generating ${exampleId}:`, error);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📁 Total: ${Object.keys(EXAMPLES_MAP).length}`);

  // Generate SUMMARY.md for GitBook
  generateSummary();
}

/**
 * Generate SUMMARY.md for GitBook navigation
 */
function generateSummary() {
  const summaryPath = path.join(process.cwd(), 'docs', 'SUMMARY.md');

  let summary = `# Summary\n\n`;
  summary += `* [Introduction](README.md)\n\n`;

  // Group by category
  const categories = new Map<string, Array<[string, any]>>();
  for (const [id, example] of Object.entries(EXAMPLES_MAP)) {
    if (!categories.has(example.category)) {
      categories.set(example.category, []);
    }
    categories.get(example.category)!.push([id, example]);
  }

  // Build summary
  for (const [category, examples] of categories) {
    summary += `## ${category}\n\n`;
    for (const [id, example] of examples) {
      const relPath = path.relative('docs', example.output).replace(/\\/g, '/');
      summary += `* [${example.title}](${relPath})\n`;
    }
    summary += `\n`;
  }

  fs.writeFileSync(summaryPath, summary);
  console.log(`\n📖 Generated GitBook summary: docs/SUMMARY.md`);
}

// Run if called directly
if (require.main === module) {
  generateAllDocs();
}

export { generateAllDocs, generateExampleReadme };
