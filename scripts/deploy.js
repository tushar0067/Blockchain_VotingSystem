const hre = require("hardhat");

async function main() {
  
  // // Get the contract factory
  // const Create = await hre.ethers.getContractFactory("Create");
  
  // // Deploy the contract with a constructor argument
  // const create = await Create.deploy();
  
  // Wait for the deployment to finish
  // await create.deployed();
  const theblockchaincoders = await hre.ethers.deployContract("Theblockchaincoders");

  await theblockchaincoders.waitForDeployment();
  console.log(`MyContract deployed to ${theblockchaincoders.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode= 1;
  });
