const { ethers } = require("hardhat");
const { exit } = process;

async function main() {
  const [creator] = await ethers.getSigners();
  console.log(creator.address);
  const contract = await ethers.getContractAt("Goals", "0xfa855B1018bc4F6e06C1d2149fd3821fF1d2E997");

  const result1 = await contract.getProofs("ApesTogetherStrong");
  const result2 = await contract.getProofOfGroupByIndex("ApesTogetherStrong", 0)

  console.log({result1, result2});
}

main()
  .then(() => exit(0))
  .catch(error => {
    console.error(error);
    exit(1);
  });
