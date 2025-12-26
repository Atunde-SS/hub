
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { BlindAuction } from "../../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
    deployer: HardhatEthersSigner;
    alice: HardhatEthersSigner;
    bob: HardhatEthersSigner;
};

async function deployFixture() {
    const factory = await ethers.getContractFactory("BlindAuction");
    const contract = (await factory.deploy()) as unknown as BlindAuction; // 1 hour duration
    const address = await contract.getAddress();
    return { contract, address };
}

describe("BlindAuction", function () {
    let signers: Signers;
    let contract: BlindAuction;
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

    it("should accept encrypted bids and determine winner correctly", async function () {
        // Alice bids 100
        const bidAlice = await fhevm.createEncryptedInput(contractAddress, signers.alice.address)
            .add32(100)
            .encrypt();
        await contract.connect(signers.alice).submitBid(bidAlice.handles[0], bidAlice.inputProof);

        // Bob bids 200
        const bidBob = await fhevm.createEncryptedInput(contractAddress, signers.bob.address)
            .add32(200)
            .encrypt();
        await contract.connect(signers.bob).submitBid(bidBob.handles[0], bidBob.inputProof);

        // Stop auction (need to advance time)
        // In mock, we can cheat or just stop if check allows?
        // Contract checks block.timestamp >= biddingEnd.
        // We need to advance time.
        await ethers.provider.send("evm_increaseTime", [3601]);
        await ethers.provider.send("evm_mine", []);

        await contract.stopAuction();

        // Determine winner (simplified)
        const tx = await contract.determineWinnerSimplified();
        await tx.wait();

        // Winner should be Bob
        const winner = await contract.highestBidder();
        expect(winner).to.equal(signers.bob.address);

        // Winning bid amount? Only readable by authorized.
        // In simplified version, it allows auctioneer to decrypt highest bid
        const highestBidHandle = await contract.connect(signers.deployer).getHighestBid();
        // Assuming deployer is auctioneer
        const decryptedHighest = await fhevm.userDecryptEuint(FhevmType.euint32, highestBidHandle, contractAddress, signers.deployer);
        // Note: Contract logic for `getHighestBid` requires AuctionState.REVEALED, set in determineWinnerSimplified
        expect(decryptedHighest).to.equal(200);
    });
});
