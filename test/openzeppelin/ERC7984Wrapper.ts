
import "@nomicfoundation/hardhat-chai-matchers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { ERC7984Wrapper } from "../../types";
import { expect } from "chai";

async function deployFixture() {
    const factory = await ethers.getContractFactory("ERC7984Wrapper");
    const mockTokenAddress = "0x0000000000000000000000000000000000000001";
    const contract = (await factory.deploy(mockTokenAddress)) as unknown as ERC7984Wrapper;
    const address = await contract.getAddress();
    return { contract, address };
}

describe("ERC7984Wrapper", function () {
    let contract: ERC7984Wrapper;
    let contractAddress: string;

    beforeEach(async function () {
        if (!fhevm.isMock) {
            this.skip();
        }
        ({ contract, address: contractAddress } = await deployFixture());
    });

    it("should deploy with underlying token", async function () {
        const underlyingToken = await contract.underlyingToken();
        expect(underlyingToken).to.not.equal(ethers.ZeroAddress);
    });

    it("should return encrypted balance", async function () {
        const [alice] = await ethers.getSigners();
        const balance = await contract.connect(alice).encryptedBalanceOf(alice.address);
        expect(balance).to.exist;
    });
});
