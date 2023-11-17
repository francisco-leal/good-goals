require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const { PRIVATE_KEY} = process.env;
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "celo",
  networks: {
    gnosis: {
      url: "https://rpc.ankr.com/gnosis",
      accounts: [`0x${PRIVATE_KEY}`]
    },
    celo: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
