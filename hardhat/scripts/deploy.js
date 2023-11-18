const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const stakingToken = process.env.STAKING_TOKEN;
  const granularity = process.env.GRANULARITY;

  const stakingTokenContract = await ethers.getContractAt("IERC20", stakingToken);

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(`Using stakingToken ${stakingToken} and granularity ${granularity}`);
  const contract = await ethers.deployContract("Goals", [stakingTokenContract, granularity]);

  console.log("contract address:", await contract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
