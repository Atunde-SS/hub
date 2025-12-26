
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { ViewFunctionAntipattern } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("ViewFunctionAntipattern");
    const contract = (await factory.deploy()) as unknown as ViewFunctionAntipattern;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("ViewFunctionAntipattern", function () {
    let signers: Signers;
    let contract: ViewFunctionAntipattern;
    let contractAddress: string;

    before(async function () {
        const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
        signers = { deployer: ethSigners[0], alice: ethSigners[1] };
    });

    beforeEach(async function () {
        if (!fhevm.isMock) {
            console.warn("This hardhat test suite cannot run on Sepolia Testnet");
            this.skip();
        }
        ({ contract, address: contractAddress } = await deployFixture());
    });

    it("should compute sum correctly in non-view function", async function () {
        const inputA = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(10)
            .encrypt();
        const inputB = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(20)
            .encrypt();

        await contract.connect(signers.alice).setValues(
            inputA.handles[0],
            inputB.handles[0],
            inputA.inputProof,
            inputB.inputProof
        );

        await contract.connect(signers.alice).computeSumCorrect();

        // We can't see result directly from tx unless we inspected logs or returned value decoding
        // But we can check precomputed sum from setValues
        const precomputed = await contract.connect(signers.alice).getPrecomputedSum();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, precomputed, contractAddress, signers.alice);
        expect(decrypted).to.equal(30);
    });
});
