
import "@nomicfoundation/hardhat-chai-matchers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { AccessControlTransient } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("AccessControlTransient");
    const contract = (await factory.deploy()) as unknown as AccessControlTransient;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("AccessControlTransient", function () {
    let signers: Signers;
    let contract: AccessControlTransient;
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

    it("should compute with transient permissions", async function () {
        const inputA = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(10)
            .encrypt();
        const inputB = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(5)
            .encrypt();

        const tx = await contract.connect(signers.alice).computeWithTransient(
            inputA.handles[0],
            inputA.inputProof,
            inputB.handles[0],
            inputB.inputProof
        );
        await expect(tx).to.emit(contract, "TransientOperationExecuted").withArgs(signers.alice.address);

        // Check stored value result (logic: sum=15, prod=50. sum > prod is false. stored = prod = 50)
        const stored = await contract.connect(signers.alice).getStoredValue();
        const decryptStored = await fhevm.userDecryptEuint(
            FhevmType.euint32,
            stored,
            contractAddress,
            signers.alice
        );
        expect(decryptStored).to.equal(50);
    });

    it("should store with persistent permissions", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(123)
            .encrypt();

        await contract.connect(signers.alice).storeWithPersistent(
            input.handles[0],
            input.inputProof
        );

        const stored = await contract.connect(signers.alice).getStoredValue();
        const decryptStored = await fhevm.userDecryptEuint(
            FhevmType.euint32,
            stored,
            contractAddress,
            signers.alice
        );
        expect(decryptStored).to.equal(123);
    });
});
