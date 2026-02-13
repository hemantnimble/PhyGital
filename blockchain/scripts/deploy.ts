import { ethers } from "hardhat";

async function main() {
  console.log("Deploying PhygitalNFT contract...");

  const PhygitalNFT = await ethers.getContractFactory("PhygitalNFT");
  const contract = await PhygitalNFT.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ PhygitalNFT deployed to:", address);
  console.log("📋 Copy this address to your Next.js .env.local as CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});