
import "@nomicfoundation/hardhat-chai-matchers";
import { ethers, fhevm } from "hardhat";
import { ConfidentialGovernor } from "../../types";
import { expect } from "chai";

async function deployFixture() {
    const factory = await ethers.getContractFactory("ConfidentialGovernor");
    const contract = (await factory.deploy()) as unknown as ConfidentialGovernor;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("ConfidentialGovernor", function () {
    beforeEach(async function () {
        if (!fhevm.isMock) {
            this.skip();
        }
    });

    it("should create proposal", async function () {
        const { contract } = await deployFixture();
        const [deployer] = await ethers.getSigners();

        const tx = await contract.connect(deployer).propose("Test Proposal");
        await expect(tx).to.emit(contract, "ProposalCreated");

        const proposalCount = await contract.proposalCount();
        expect(proposalCount).to.equal(1);
    });

    it("should set voting power", async function () {
        const { contract } = await deployFixture();
        const [deployer, voter] = await ethers.getSigners();

        await contract.connect(deployer).setVotingPower(voter.address, 100);
        // Voting power is encrypted, so we just verify no revert
    });

    it("should allow voting on proposal", async function () {
        const { contract } = await deployFixture();
        const [deployer, voter] = await ethers.getSigners();

        await contract.connect(deployer).setVotingPower(voter.address, 100);
        await contract.connect(deployer).propose("Test Vote");

        await expect(contract.connect(voter).castVote(0, true))
            .to.emit(contract, "VoteCast");
    });
});
