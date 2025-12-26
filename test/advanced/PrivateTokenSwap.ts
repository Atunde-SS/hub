
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { PrivateTokenSwap } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("PrivateTokenSwap");
    const contract = (await factory.deploy()) as unknown as PrivateTokenSwap;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("PrivateTokenSwap", function () {
    let signers: Signers;
    let contract: PrivateTokenSwap;
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

    it("should swap tokens correctly", async function () {
        // Deposit 100 Token A
        const inputA = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(100)
            .encrypt();
        await contract.connect(signers.alice).depositTokenA(inputA.handles[0], inputA.inputProof);

        // Swap 40 A for B
        const inputSwap = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(40)
            .encrypt();
        await contract.connect(signers.alice).swapAforB(inputSwap.handles[0], inputSwap.inputProof);

        // Check balances
        const balA = await contract.connect(signers.alice).getBalanceTokenA();
        const decA = await fhevm.userDecryptEuint(FhevmType.euint32, balA, contractAddress, signers.alice);
        expect(decA).to.equal(60);

        const balB = await contract.connect(signers.alice).getBalanceTokenB();
        const decB = await fhevm.userDecryptEuint(FhevmType.euint32, balB, contractAddress, signers.alice);
        expect(decB).to.equal(40);
    });
});
