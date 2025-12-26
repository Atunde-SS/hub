
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { HandleReuseErrors } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("HandleReuseErrors");
    const contract = (await factory.deploy()) as unknown as HandleReuseErrors;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("HandleReuseErrors", function () {
    let signers: Signers;
    let contract: HandleReuseErrors;
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

    it("should store handle correctly", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(42)
            .encrypt();

        await contract.connect(signers.alice).storeHandle(input.handles[0], input.inputProof);

        const stored = await contract.connect(signers.alice).getStored();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, stored, contractAddress, signers.alice);
        expect(decrypted).to.equal(42);
    });

    it("should add to stored handle correctly", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(10) // 42+10 = 52
            .encrypt();

        await contract.connect(signers.alice).addToStored(input.handles[0], input.inputProof);

        const stored = await contract.connect(signers.alice).getStored();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, stored, contractAddress, signers.alice);
        expect(decrypted).to.equal(52);
    });
});
