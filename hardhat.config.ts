import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "@fhevm/hardhat-plugin";
import * as dotenv from "dotenv";

dotenv.config();

// Get configuration from environment variables
const MNEMONIC = process.env.MNEMONIC || "test test test test test test test test test test test junk";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.24",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            evmVersion: "cancun",
        },
    },

    networks: {
        hardhat: {
            accounts: {
                mnemonic: MNEMONIC,
                count: 10,
            },
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            accounts: {
                mnemonic: MNEMONIC,
            },
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
            accounts: {
                mnemonic: MNEMONIC,
            },
            chainId: 11155111,
        },
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        alice: {
            default: 1,
        },
        bob: {
            default: 2,
        },
    },

    etherscan: {
        apiKey: {
            sepolia: ETHERSCAN_API_KEY,
        },
    },

    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts",
    },

    mocha: {
        timeout: 120000, // 2 minutes
    },

    gasReporter: {
        enabled: process.env.REPORT_GAS === "true",
        currency: "USD",
    },

    typechain: {
        outDir: "types",
        target: "ethers-v6",
    },
};

export default config;