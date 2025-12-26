#!/usr/bin/env ts-node

/**
 * generate-frontend-component.ts
 * Generates contract-specific React components by parsing Solidity ABI
 */

import * as fs from 'fs';
import * as path from 'path';

interface ContractFunction {
  name: string;
  inputs: Array<{ name: string; type: string }>;
  outputs: Array<{ name: string; type: string }>;
  stateMutability: string;
}

/**
 * Extract functions from compiled contract ABI
 */
export function extractContractFunctions(abiPath: string): ContractFunction[] {
  if (!fs.existsSync(abiPath)) {
    console.warn(`⚠️  ABI not found: ${abiPath}`);
    return [];
  }

  const artifact = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
  const abi = artifact.abi || [];

  return abi
    .filter((item: any) => item.type === 'function')
    .map((fn: any) => ({
      name: fn.name,
      inputs: fn.inputs || [],
      outputs: fn.outputs || [],
      stateMutability: fn.stateMutability || 'nonpayable',
    }));
}

/**
 * Generate React component for a specific contract function
 */
function generateFunctionComponent(fn: ContractFunction): string {
  const isView = fn.stateMutability === 'view' || fn.stateMutability === 'pure';
  const encryptedInput = fn.inputs.find(input => input.type.includes('uint') && !input.type.includes('[]'));
  const isExternalEncrypted = fn.inputs.some(input => input.type === 'bytes32' || input.type === 'bytes');

  let component = `
  // ${fn.name} Function
  const [${fn.name}Loading, set${capitalize(fn.name)}Loading] = useState(false);
  ${fn.inputs.map(input => `const [${fn.name}${capitalize(input.name)}, set${capitalize(fn.name)}${capitalize(input.name)}] = useState('');`).join('\n  ')}

  const handle${capitalize(fn.name)} = async () => {
    set${capitalize(fn.name)}Loading(true);
    try {
      let args: any[] = [${fn.inputs.map(i => `${fn.name}${capitalize(i.name)}`).join(', ')}];
      
      ${encryptedInput ? `
      // Encrypt input using FHEVM
      const fhevm = await initFhevm();
      const encrypted = await fhevm.encrypt32(parseInt(${fn.name}${capitalize(encryptedInput.name)}));
      
      // Update args with encrypted value
      args = [${fn.inputs.map(i => i.name === encryptedInput.name ? 'encrypted' : `${fn.name}${capitalize(i.name)}`).join(', ')}];
      ` : ''}

      ${isExternalEncrypted && fn.name === 'transfer' ? `
      // Special handling for transfer with externalEuint32
      const fhevm = await initFhevm();
      const amountToEncrypt = ${fn.name}${capitalize(fn.inputs.find(i => i.name.toLowerCase().includes('amount'))?.name || '1')};
      const { ciphertext, signature } = await fhevm.encrypt32(parseInt(amountToEncrypt));
      // In a real scenario, this would be more complex, but for demo we show the logic
      ` : ''}
      
      // Call contract function
      console.log('Calling ${fn.name}...');
      
      ${isView ? `
      // View function - read from contract
      // Note: In a production app, you'd use useReadContract hook directly for state
      // This handle is for manual checking/debugging
      alert('${capitalize(fn.name)} call initiated. Check console for result.');
      ` : `
      // Write function - send transaction
      write({
        address: CONTRACT_ADDRESS as \`0x\${string}\`,
        abi: contractABI,
        functionName: '${fn.name}',
        ${fn.inputs.length > 0 ? `args: args,` : ''}
      });
      `}
      
      ${!isView ? `alert('${capitalize(fn.name)} transaction sent!');` : ''}
    } catch (error) {
      console.error('Error:', error);
      alert('Error calling ${fn.name}');
    } finally {
      set${capitalize(fn.name)}Loading(false);
    }
  };`;

  return component;
}

/**
 * Generate complete ContractInteraction component for a specific contract
 */
export function generateContractComponent(
  contractName: string,
  functions: ContractFunction[]
): string {
  const writeFunctions = functions.filter(f =>
    f.stateMutability !== 'view' && f.stateMutability !== 'pure'
  );
  const readFunctions = functions.filter(f =>
    f.stateMutability === 'view' || f.stateMutability === 'pure'
  );

  return `'use client';

import { useState } from 'react';
import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { parseAbi } from 'viem';
import { initFhevm } from '../../lib/fhevm';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x...';

// Contract ABI - will be injected during build
const contractABI = parseAbi([
  ${functions.map(f => `'function ${f.name}(${f.inputs.map(i => `${i.type} ${i.name}`).join(', ')})${f.stateMutability === 'view' || f.stateMutability === 'pure' ? ' view' : ''} returns (${f.outputs.map(o => o.type).join(', ')})'`).join(',\n  ')}
]);

export default function ${contractName}Interaction() {
  const { address } = useAccount();
  
  // Write Contract Hook
  const { writeContract: write, isPending: isWritePending } = useWriteContract();

  ${functions.map(fn => generateFunctionComponent(fn)).join('\n\n')}

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Write Functions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Contract Functions</h2>
        
        ${writeFunctions.map(fn => `
        <div className="glass rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">${capitalize(fn.name)}</h3>
          ${fn.inputs.map(input => `
          <div className="mb-4">
            <label className="block text-purple-200 mb-2">${capitalize(input.name)}</label>
            <input
              type="${input.type.includes('address') ? 'text' : 'number'}"
              value={${fn.name}${capitalize(input.name)}}
              onChange={(e) => set${capitalize(fn.name)}${capitalize(input.name)}(e.target.value)}
              placeholder="${input.type.includes('uint') ? '🔐 Will be encrypted' : `Enter ${input.name}...`}"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-400/30 text-white focus:outline-none focus:border-purple-400"
            />
          </div>
          `).join('')}
          <button
            onClick={handle${capitalize(fn.name)}}
            disabled={${fn.name}Loading || isWritePending}
            className="btn-primary w-full"
          >
            {${fn.name}Loading || isWritePending ? 'Processing...' : '${capitalize(fn.name)}'}
          </button>
        </div>
        `).join('\n')}
      </div>

      {/* Read Functions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Contract State</h2>
        
        ${readFunctions.slice(0, 5).map(fn => `
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">${capitalize(fn.name)}</h3>
          <div className="text-xl font-mono text-purple-300 break-all">
            {/* Display result here if available */}
            🔒 Encrypted Value
          </div>
          <button
            onClick={handle${capitalize(fn.name)}}
            disabled={${fn.name}Loading}
            className="mt-4 text-sm text-purple-400 hover:text-purple-300 underline"
          >
            {${fn.name}Loading ? 'Loading...' : 'Check ${capitalize(fn.name)}'}
          </button>
        </div>
        `).join('\n')}
      </div>
    </div>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
