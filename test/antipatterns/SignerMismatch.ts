import "@nomicfoundation/hardhat-chai-matchers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { SignerMismatch } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
    bob: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("SignerMismatch");
    const contract = (await factory.deploy()) as unknown as SignerMismatch;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("SignerMismatch Antipattern", function () {
    let signers: Signers;
    let contract: SignerMismatch;
    let contractAddress: string;

    before(async function () {
        const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
        signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
    });

    beforeEach(async function () {
        if (!fhevm.isMock) {
            console.warn("This hardhat test suite cannot run on Sepolia Testnet");
            this.skip();
        }
        ({ contract, address: contractAddress } = await deployFixture());
    });

    it("should succeed when signer matches msg.sender", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(100)
            .encrypt();

        await contract.connect(signers.alice).storeValue(input.handles[0], input.inputProof);

        // Check decryption
        const handle = await contract.connect(signers.alice).getValue();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, handle, contractAddress, signers.alice);
        expect(decrypted).to.equal(100);
    });

    it("should revert when signer does not match msg.sender", async function () {
        // Input encrypted by Alice
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(100)
            .encrypt();

        // Bob tries to submit Alice's input
        // The proof verification in FHE.fromExternal checks msg.sender vs signer in proof
        await expect(
            contract.connect(signers.bob).storeValue(input.handles[0], input.inputProof)
        ).to.be.reverted;
        // Exact revert reason depends on FHEVM lib, usually "Invalid proof" or similar
    });
});
