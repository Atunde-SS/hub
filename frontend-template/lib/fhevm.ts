import { createInstance } from 'fhevmjs';

let fhevmInstance: any = null;

export async function initFhevm() {
    if (!fhevmInstance) {
        fhevmInstance = await createInstance({
            chainId: 8009, // Zama Sepolia
            publicKey: '', // Will be fetched from contract
        });
    }
    return fhevmInstance;
}

export async function encryptValue(value: number | boolean): Promise<{ data: Uint8Array; handles: string[] }> {
    const instance = await initFhevm();
    const encrypted = instance.encrypt32(value);
    return encrypted;
}

export function getFhevmInstance() {
    return fhevmInstance;
}
