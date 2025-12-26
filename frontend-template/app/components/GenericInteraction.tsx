"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { initFhevm } from "@/lib/fhevm";

const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// Try to load ABI safely
let contractABI: any[] = [];
try {
  contractABI = require("@/lib/contract-abi.json");
} catch (e) {
  console.warn("ABI not found in @/lib/contract-abi.json");
}

export default function GenericInteraction() {
  const { isConnected } = useAccount();
  const {
    writeContract,
    data: txHash,
    error: writeError,
    isPending,
  } = useWriteContract();

  const [functions, setFunctions] = useState<any[]>([]);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [encryptionState, setEncryptionState] = useState<
    Record<string, boolean>
  >({});
  const [logs, setLogs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // Only render after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (contractABI.length > 0) {
      const fns = contractABI.filter((item: any) => item.type === "function");
      setFunctions(fns);

      // Initialize form state
      const initialForm: Record<string, any> = {};
      fns.forEach((fn: any) => {
        fn.inputs.forEach((input: any) => {
          initialForm[`${fn.name}_${input.name}`] = "";
        });
      });
      setFormState(initialForm);
    }
  }, []);

  const addLog = (msg: string) => {
    setLogs((prev) =>
      [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10)
    );
  };

  const handleInputChange = (
    fnName: string,
    inputName: string,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [`${fnName}_${inputName}`]: value,
    }));
  };

  const toggleEncryption = (fnName: string, inputName: string) => {
    setEncryptionState((prev) => ({
      ...prev,
      [`${fnName}_${inputName}`]: !prev[`${fnName}_${inputName}`],
    }));
  };

  const handleCall = async (fn: any) => {
    try {
      addLog(`Calling ${fn.name}...`);
      const args = await Promise.all(
        fn.inputs.map(async (input: any) => {
          const val = formState[`${fn.name}_${input.name}`];
          const shouldEncrypt = encryptionState[`${fn.name}_${input.name}`];

          if (shouldEncrypt && val) {
            addLog(`Encrypting ${input.name}...`);
            const fhevm = await initFhevm();
            // Basic heuristic: check if it's likely a 32-bit int
            return await fhevm.encrypt32(parseInt(val));
          }

          // Try to parse numbers if they look like numbers
          if (!isNaN(val) && val !== "") return BigInt(val);
          return val;
        })
      );

      if (fn.stateMutability === "view" || fn.stateMutability === "pure") {
        addLog(
          "Read functions not yet supported in this generic UI. Use wagmi useReadContract manually."
        );
      } else {
        writeContract({
          address: CONTRACT_ADDRESS,
          abi: contractABI,
          functionName: fn.name,
          args: args,
        });
      }
    } catch (err: any) {
      addLog(`Error: ${err.message}`);
      console.error(err);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || !isConnected) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">🛠️</span> Smart Contract Functions
        </h2>

        {functions.length === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-yellow-200">
            No functions found in ABI. Please sync your ABI to{" "}
            <code>lib/contract-abi.json</code>.
          </div>
        )}

        {functions.map((fn, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white font-mono">
                  {fn.name}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    fn.stateMutability === "view"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-orange-500/20 text-orange-300"
                  }`}
                >
                  {fn.stateMutability}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {fn.inputs.map((input: any, iIdx: number) => (
                <div key={iIdx} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <label className="text-purple-200 font-medium">
                      {input.name || `arg${iIdx}`}{" "}
                      <span className="text-purple-400 text-xs font-mono">
                        ({input.type})
                      </span>
                    </label>

                    {/* FHE Toggle */}
                    <label className="flex items-center cursor-pointer group">
                      <span className="mr-2 text-xs text-purple-300 group-hover:text-white transition-colors">
                        Encrypted?
                      </span>
                      <input
                        type="checkbox"
                        className="form-checkbox h-3 w-3 text-purple-600 bg-white/5 border-purple-500 rounded focus:ring-purple-500"
                        checked={!!encryptionState[`${fn.name}_${input.name}`]}
                        onChange={() => toggleEncryption(fn.name, input.name)}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder={`Enter ${input.type}...`}
                    className="w-full px-3 py-2 rounded bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500"
                    value={formState[`${fn.name}_${input.name}`] || ""}
                    onChange={(e) =>
                      handleInputChange(fn.name, input.name, e.target.value)
                    }
                  />
                </div>
              ))}

              <button
                onClick={() => handleCall(fn)}
                disabled={isPending}
                className={`w-full py-2.5 rounded font-bold transition-all transform active:scale-95 ${
                  fn.stateMutability === "view"
                    ? "bg-blue-600/50 hover:bg-blue-600 text-white opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/20"
                }`}
              >
                {isPending
                  ? "⏳ Sending..."
                  : fn.stateMutability === "view"
                  ? "Read (Manual Only)"
                  : "🚀 Execute"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar: Logs & Details */}
      <div className="space-y-6">
        <div className="bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">📜</span> Transaction Logs
          </h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {logs.length === 0 && (
              <p className="text-white/30 italic text-sm">
                No activity recorded...
              </p>
            )}
            {logs.map((log, i) => (
              <div
                key={i}
                className="text-xs font-mono p-2 bg-white/5 rounded border-l-2 border-purple-500 text-purple-100 break-words"
              >
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/20">
          <h3 className="text-xl font-bold text-white mb-4">
            🔑 Configuration
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-indigo-300 font-medium">Contract Address</p>
              <p className="text-white font-mono break-all">
                {CONTRACT_ADDRESS || "Not Configured"}
              </p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <p className="text-indigo-300 font-medium">Network</p>
              <p className="text-white">Sepolia / Localhost</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
