const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Goals contract", function () {
  it("quick integration test", async function () {
    const [owner] = await ethers.getSigners();

    const goalsContract = await ethers.deployContract("Goals", [owner.address, 60]);

    const tx = await goalsContract.connect(owner).createGroup("ApesTogetherStrong", 30, 1000000000000n);
    await tx.wait();

    expect(await goalsContract.groupExists("ApesTogetherStrong")).to.equal(true);
  });
});
