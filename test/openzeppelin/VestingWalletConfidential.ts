
import "@nomicfoundation/hardhat-chai-matchers";
import { ethers, fhevm } from "hardhat";
import { VestingWalletConfidential } from "../../types";
import { expect } from "chai";

async function deployFixture() {
    const [deployer, beneficiary] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("VestingWalletConfidential");
    const startTime = Math.floor(Date.now() / 1000);
    const duration = 365 * 24 * 60 * 60; // 1 year
    const amount = 10000;

    const contract = (await factory.deploy(
        beneficiary.address,
        startTime,
        duration,
        amount
    )) as unknown as VestingWalletConfidential;
    const address = await contract.getAddress();
    return { contract, address, beneficiary };
}

describe("VestingWalletConfidential", function () {
    beforeEach(async function () {
        if (!fhevm.isMock) {
            this.skip();
        }
    });

    it("should deploy with correct beneficiary", async function () {
        const { contract, beneficiary } = await deployFixture();
        const contractBeneficiary = await contract.beneficiary();
        expect(contractBeneficiary).to.equal(beneficiary.address);
    });

    it("should have vested amount", async function () {
        const { contract, beneficiary } = await deployFixture();
        const vestedAmount = await contract.connect(beneficiary).getVestedAmount();
        expect(vestedAmount).to.exist;
    });

    it("should allow beneficiary to release", async function () {
        const { contract, beneficiary } = await deployFixture();
        await expect(contract.connect(beneficiary).release()).to.emit(contract, "TokensReleased");
    });
});
