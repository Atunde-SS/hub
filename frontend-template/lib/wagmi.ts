'use client';

import { createConfig, http } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';

// Use a placeholder projectId - for local development and testing
// For production, get one from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || 'a48da7a491bae47d2886a44f914efc8a';

export const config = getDefaultConfig({
    appName: 'FHEVM Example dApp',
    projectId: projectId,
