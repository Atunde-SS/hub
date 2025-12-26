'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import GenericInteraction from './components/GenericInteraction';

export default function Home() {
    const { isConnected } = useAccount();

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">
                            FHEVM Explorer
                        </h1>
                        <p className="text-purple-200">
                            Interact with confidential smart contracts via FHEVM
                        </p>
                    </div>
                    <ConnectButton />
                </header>

                {/* Main Content */}
                {isConnected ? (
                    <GenericInteraction />
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 max-w-md mx-auto border border-white/20">
                            <svg
                                className="w-24 h-24 mx-auto mb-6 text-purple-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                Connect Your Wallet
                            </h2>
                            <p className="text-purple-200 mb-8">
                                Connect your wallet to interact with confidential smart contracts using FHE
                            </p>
                            <ConnectButton />
                        </div>
                    </div>
                )}

                {/* Footer */}
                <footer className="mt-20 text-center text-purple-300">
                    <p>Powered by <span className="font-bold">Zama FHEVM</span></p>
                </footer>
            </div>
        </main>
    );
}
