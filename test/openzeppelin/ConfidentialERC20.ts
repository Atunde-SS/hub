
import "@nomicfoundation/hardhat-chai-matchers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { ConfidentialERC20 } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
    bob: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("ConfidentialERC20");
    const contract = (await factory.deploy()) as unknown as ConfidentialERC20;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("ConfidentialERC20", function () {
    let signers: Signers;
    let contract: ConfidentialERC20;
    let contractAddress: string;

    before(async function () {
        const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
        signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
    });

    beforeEach(async function () {
        if (!fhevm.isMock) {
            console.warn("This test suite requires mock mode");
            this.skip();
        }
        ({ contract, address: contractAddress } = await deployFixture());
    });

    it("should mint tokens to address", async function () {
        await contract.connect(signers.deployer).mint(signers.alice.address, 1000);
        const totalSupply = await contract.totalSupply();
        expect(totalSupply).to.equal(1000);
    });

    it("should have encrypted balance", async function () {
        await contract.connect(signers.deployer).mint(signers.alice.address, 500);
        const encryptedBalance = await contract.connect(signers.alice).balanceOf(signers.alice.address);
        const balance = await fhevm.userDecryptEuint(FhevmType.euint32, encryptedBalance, contractAddress, signers.alice);
        expect(balance).to.equal(500);
    });

    it("should transfer encrypted tokens", async function () {
        await contract.connect(signers.deployer).mint(signers.alice.address, 1000);

        const input = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(200)
            .encrypt();

        await contract.connect(signers.alice).transfer(signers.bob.address, input.handles[0], input.inputProof);

        const bobBalance = await contract.connect(signers.bob).balanceOf(signers.bob.address);
        const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, bobBalance, contractAddress, signers.bob);
        expect(decrypted).to.equal(200);
    });
});
