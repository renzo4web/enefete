import { expect } from "chai";
import { ethers } from "hardhat";

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const EpicNft = await ethers.getContractFactory("EpicNFT");
    const nftContract = await EpicNft.deploy();
    await nftContract.deployed();

    const mintedNft = await nftContract.makeNFT("Hola soy yo");

    // wait until the transaction is mined
    await mintedNft.wait();
  });
});
