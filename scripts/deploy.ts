import { ethers } from "hardhat";

async function main() {
  const nftContractFactory = await ethers.getContractFactory("EpicNFT");
  const nftContract = await nftContractFactory.deploy({
    value: ethers.utils.parseEther("0.001"),
  });

  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
