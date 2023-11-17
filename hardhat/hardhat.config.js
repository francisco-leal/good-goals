require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const INFURA_API_KEY = "KEY";

module.exports = {
  solidity: "0.8.19",
  networks: {
    gnosis: {
      url: "https://rpc.ankr.com/gnosis",
      accounts: [GNOSIS_PRIVATE_KEY]
    },
  }
};
