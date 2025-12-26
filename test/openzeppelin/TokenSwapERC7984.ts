
import "@nomicfoundation/hardhat-chai-matchers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { TokenSwapERC7984 } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

async function deployFixture() {
    const factory = await ethers.getContractFactory("TokenSwapERC7984");
    const contract = (await factory.deploy()) as unknown as TokenSwapERC7984;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("TokenSwapERC7984", function () {
    let signers: HardhatEthersSigner[];
    let contract: TokenSwapERC7984;
    let contractAddress: string;

    beforeEach(async function () {
        if (!fhevm.isMock) {
            this.skip();
        }
        signers = await ethers.getSigners();
        ({ contract, address: contractAddress } = await deployFixture());
    });

    it("should deposit Token A", async function () {
        const input = await fhevm.createEncryptedInput(contractAddress, signers[0].address)
            .add32(100)
            .encrypt();

        await contract.connect(signers[0]).depositTokenA(input.handles[0], input.inputProof);
        const balance = await contract.connect(signers[0]).getBalanceTokenA();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, balance, contractAddress, signers[0]);
        expect(decrypted).to.equal(100);
    });

    it("should swap A for B", async function () {
        const depositInput = await fhevm.createEncryptedInput(contractAddress, signers[0].address)
            .add32(100)
            .encrypt();
        await contract.connect(signers[0]).depositTokenA(depositInput.handles[0], depositInput.inputProof);

        const swapInput = await fhevm.createEncryptedInput(contractAddress, signers[0].address)
            .add32(50)
            .encrypt();
        await contract.connect(signers[0]).swapAforB(swapInput.handles[0], swapInput.inputProof);

        const balanceB = await contract.connect(signers[0]).getBalanceTokenB();
        const decrypted = await fhevm.userDecryptEuint(FhevmType.euint32, balanceB, contractAddress, signers[0]);
        expect(decrypted).to.equal(50);
    });
});
