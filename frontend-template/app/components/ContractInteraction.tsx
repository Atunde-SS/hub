'use client';

import { useState } from 'react';
import { useWriteContract, useReadContract } from 'wagmi';
import { parseAbi } from 'viem';
import { initFhevm } from '@/lib/fhevm';

// This will be injected by the automation script
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x...';

export default function ContractInteraction() {
    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [loading, setLoading] = useState(false);

    // Example: Read encrypted balance
    const { data: balance } = useReadContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: parseAbi([
            'function balanceOf(address) view returns (uint256)',
        ]),
        functionName: 'balanceOf',
    });

    const handleEncryptAndSend = async () => {
        setLoading(true);
        try {
            // Initialize FHEVM
            const fhevm = await initFhevm();

            // Encrypt the amount
            const encrypted = await fhevm.encrypt32(parseInt(amount));

            // Send transaction with encrypted data
            console.log('Encrypted value:', encrypted);

            alert('Transaction sent! (Demo mode)');
        } catch (error) {
            console.error('Error:', error);
            alert('Error encrypting value');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Contract Interaction */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Contract Functions
                </h2>

                {/* Function: Mint/Transfer Tokens */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-purple-200 mb-2 font-medium">
                            Amount (will be encrypted)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-400/30 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                            placeholder="Enter amount..."
                        />
                    </div>

                    <div>
                        <label className="block text-purple-200 mb-2 font-medium">
                            Recipient Address
                        </label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-purple-400/30 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400"
                            placeholder="0x..."
                        />
                    </div>

                    <button
                        onClick={handleEncryptAndSend}
                        disabled={loading || !amount}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Encrypting...
                            </span>
                        ) : (
                            '🔐 Encrypt & Send'
                        )}
                    </button>
                </div>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <p className="text-sm text-blue-200">
                        <strong>ℹ️ Privacy:</strong> Your value will be encrypted using FHEVM before being sent on-chain. No one can see the actual amount!
                    </p>
                </div>
            </div>

            {/* Right Panel - Encryption Visualization */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Encryption Details
                </h2>

                <div className="space-y-6">
                    {/* Current Balance */}
                    <div className="p-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-400/30">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-200 font-medium">Your Balance</span>
                            <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded">
                                Encrypted
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white font-mono">
                            {balance ? '🔒 ****' : '---'}
                        </div>
                        <p className="text-xs text-green-200 mt-2">
                            Only you can decrypt this value
                        </p>
                    </div>

                    {/* Encryption Steps */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white">How it works:</h3>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                1
                            </div>
                            <div>
                                <p className="text-white font-medium">Input Value</p>
                                <p className="text-purple-200 text-sm">Enter your plaintext amount</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                2
                            </div>
                            <div>
                                <p className="text-white font-medium">Client-Side Encryption</p>
                                <p className="text-purple-200 text-sm">FHEVM encrypts in your browser</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                3
                            </div>
                            <div>
                                <p className="text-white font-medium">On-Chain Storage</p>
                                <p className="text-purple-200 text-sm">Encrypted data stored on blockchain</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                4
                            </div>
                            <div>
                                <p className="text-white font-medium">FHE Operations</p>
                                <p className="text-purple-200 text-sm">Compute on encrypted data directly</p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl font-bold text-white">256-bit</div>
                            <div className="text-sm text-purple-200">Encryption Key</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4">
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="text-sm text-purple-200">Privacy</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
