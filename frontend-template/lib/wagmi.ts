'use client';

import { createConfig, http } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

export const config = getDefaultConfig({
    appName: 'FHEVM Example dApp',
    projectId: 'YOUR_PROJECT_ID',
    chains: [sepolia, hardhat],
    transports: {
        [sepolia.id]: http(),
        [hardhat.id]: http('http://127.0.0.1:8545'),
    },
});
