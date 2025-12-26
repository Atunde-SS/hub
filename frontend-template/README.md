# Frontend Template (Optional)

This is a **static frontend template** that you can optionally use with your generated FHEVM examples.

## Quick Start

1. **After generating your example**:
```bash
npx ts-node scripts/create-fhevm-example.ts my-example ./my-project
cd my-project
```

2. **Copy the frontend template**:
```bash
cp -r ../base-template/frontend ./frontend
cd frontend
npm install
```

3. **Configure your contract**:
Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<your-deployed-contract-address>
```

4. **Update contract ABI**:
Copy your contract's ABI from `artifacts/contracts/YourContract.sol/YourContract.json` to `frontend/lib/contract-abi.json`

5. **Run**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- ✅ Wallet connection (RainbowKit)
- ✅ FHEVM integration (fhevmjs)
- ✅ Modern UI (Next.js 15 + React 19)
- ✅ TypeScript
- ✅ Tailwind CSS

## Manual Setup

Since this is a static template, you'll need to:

1. Deploy your contract
2. Copy the deployed address to `.env.local`
3. Copy the ABI to `lib/contract-abi.json`
4. Update `app/page.tsx` to call your contract functions

## Example Integration

Edit `app/page.tsx` to interact with your contract:

```typescript
import { useWriteContract } from 'wagmi';
import contractABI from '../lib/contract-abi.json';

// In your component:
const { writeContract } = useWriteContract();

const handleMint = async () => {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
  
  writeContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'mint',
    args: [encryptedAmount],
  });
};
```

## Why Static?

This template is intentionally **simple and static** rather than auto-generated because:
- ✅ More reliable (no generation bugs)
- ✅ Easier to customize
- ✅ Clear learning path
- ✅ You have full control

For complex UIs, this gives you a solid starting point to build from.
