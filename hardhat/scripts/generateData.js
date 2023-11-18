const { ethers } = require("hardhat");
const { exit } = process;

async function main() {
  const [creator] = await ethers.getSigners();
  console.log(creator.address);
  const contract = await ethers.getContractAt("Goals", "0xfd24AEE56367A827f4f730180dd8E3060c6021dE");

  let tx;
  console.log("contract loaded");
  tx = await contract.createGroup("ape", 3);
  console.log("group created: ", tx);

  const stakingTokenContract = await ethers.getContractAt("IERC20", "0x7d91e51c8f218f7140188a155f5c75388630b6a8");

  console.log("trying to approve: ", contract.address);

  await stakingTokenContract.connect(creator).approve(contract.address, 100000000000000000n);

  console.log("approved");

  tx = await contract.joinGroup("ape", "jump a lot", "I really want to jump a lot and often", 100000000000000000n)

  console.log("joined group: ", tx);
}

main()
  .then(() => exit(0))
  .catch(error => {
    console.error(error);
    exit(1);
  });
