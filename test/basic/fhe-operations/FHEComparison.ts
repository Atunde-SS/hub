
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { FHEComparison } from "../../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("FHEComparison");
    const contract = (await factory.deploy()) as FHEComparison;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("FHEComparison", function () {
    let signers: Signers;
    let contract: FHEComparison;
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

    it("should compare equal values correctly (eq)", async function () {
        const inputA = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(10)
            .encrypt();
        const inputB = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(10)
            .encrypt();

        await contract.connect(signers.alice).setValues(inputA.handles[0], inputA.inputProof, inputB.handles[0], inputB.inputProof);
        await contract.connect(signers.alice).checkEqual();

        const result = await contract.connect(signers.alice).getComparisonResult();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.ebool, result, contractAddress, signers.alice); // Note: ebool
        expect(decrypted).to.be.true; // 10 == 10
    });

    it("should compare greater than correctly (gt)", async function () {
        const inputA = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(20)
            .encrypt();
        const inputB = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(10)
            .encrypt();

        await contract.connect(signers.alice).setValues(inputA.handles[0], inputA.inputProof, inputB.handles[0], inputB.inputProof);
        await contract.connect(signers.alice).checkGreaterThan();

        const result = await contract.connect(signers.alice).getComparisonResult();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.ebool, result, contractAddress, signers.alice);
        expect(decrypted).to.be.true; // 20 > 10
    });
});
