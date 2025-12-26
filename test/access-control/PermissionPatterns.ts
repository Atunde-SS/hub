
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { PermissionPatterns } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
    bob: HardhatEthersSigner;
    charlie: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("PermissionPatterns");
    const contract = (await factory.deploy()) as unknown as PermissionPatterns;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("PermissionPatterns", function () {
    let signers: Signers;
    let contract: PermissionPatterns;
    let contractAddress: string;

    before(async function () {
        const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
        signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2], charlie: ethSigners[3] };
    });

    beforeEach(async function () {
        if (!fhevm.isMock) {
            console.warn("This hardhat test suite cannot run on Sepolia Testnet");
            this.skip();
        }
        ({ contract, address: contractAddress } = await deployFixture());
    });

    it("should deposit to balance and allow owner to decrypt", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(100)
            .encrypt();

        await contract.connect(signers.alice).depositToBalance(input.handles[0], input.inputProof);

        const balance = await contract.connect(signers.alice).getBalance(signers.alice.address);
        const decrypted = await fhevm.userDecryptEuint(
            FhevmType.euint32,
            balance,
            contractAddress,
            signers.alice
        );
        expect(decrypted).to.equal(100);
    });

    it("should create shared data and allow authorized users", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(777)
            .encrypt();

        const authorized = [signers.bob.address, signers.charlie.address];
        const tx = await contract.connect(signers.alice).createSharedData(
            input.handles[0],
            input.inputProof,
            authorized
        );

        // We can't easily get the return value from tx, so we assume ID 0 since it's first
        const dataId = 0;

        // Alice (creator) should access
        const valAlice = await contract.connect(signers.alice).getSharedDataValue(dataId);
        const decryptedAlice = await fhevm.userDecryptEuint(FhevmType.euint32, valAlice, contractAddress, signers.alice);
        expect(decryptedAlice).to.equal(777);

        // Bob (authorized) should access
        const valBob = await contract.connect(signers.bob).getSharedDataValue(dataId);
        const decryptedBob = await fhevm.userDecryptEuint(FhevmType.euint32, valBob, contractAddress, signers.bob);
        expect(decryptedBob).to.equal(777);
    });

    it("should grant access to new user later", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(888)
            .encrypt();

        await contract.connect(signers.alice).createSharedData(
            input.handles[0],
            input.inputProof,
            [] // No initial users
        );
        const dataId = 0;

        // Bob cannot decrypt yet (implied)

        // Alice grants access to Bob
        await contract.connect(signers.alice).grantAccessToSharedData(dataId, signers.bob.address);

        const valBob = await contract.connect(signers.bob).getSharedDataValue(dataId);
        const decryptedBob = await fhevm.userDecryptEuint(FhevmType.euint32, valBob, contractAddress, signers.bob);
        expect(decryptedBob).to.equal(888);
    });

    it("should transfer balance correctly", async function () {
        // Alice deposits 100
        const input100 = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(100)
            .encrypt();
        await contract.connect(signers.alice).depositToBalance(input100.handles[0], input100.inputProof);

        // Alice transfers 40 to Bob
        const input40 = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(40)
            .encrypt();

        await contract.connect(signers.alice).transferBalance(signers.bob.address, input40.handles[0], input40.inputProof);

        // Check Alice balance (60)
        const balAlice = await contract.connect(signers.alice).getBalance(signers.alice.address);
        const decAlice = await fhevm.userDecryptEuint(FhevmType.euint32, balAlice, contractAddress, signers.alice);
        expect(decAlice).to.equal(60);

        // Check Bob balance (40)
        const balBob = await contract.connect(signers.bob).getBalance(signers.bob.address);
        const decBob = await fhevm.userDecryptEuint(FhevmType.euint32, balBob, contractAddress, signers.bob);
        expect(decBob).to.equal(40);
    });
});
