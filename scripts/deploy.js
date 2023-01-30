// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Reentrant = await hre.ethers.getContractFactory("Reentrant");
  const reentrant = await Reentrant.deploy();

  await reentrant.deployed();

  console.log(
    `Reentrant contract is deployed to ${reentrant.address}`
  );

  const ReentrancyAttackExploit = await hre.ethers.getContractFactory("ReentrancyAttackExploit");
  const attack = await ReentrancyAttackExploit.deploy(reentrant.address);

  await attack.deployed();

  console.log(
    `ReentrancyAttackExploit contract is deployed to ${attack.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
