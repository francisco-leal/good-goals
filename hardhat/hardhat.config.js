require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const { PRIVATE_KEY} = process.env;
module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "alfajores",
  networks: {
    gnosis: {
      url: "https://rpc.ankr.com/gnosis",
      accounts: [`0x${PRIVATE_KEY}`]
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 44787,
    }
  },
  etherscan: {
    apiKey: {
      alfajores: "9FYBMCJ8MJEF9Z6Y64MY9CBNF95KRE3VMJ",
      celo: "9FYBMCJ8MJEF9Z6Y64MY9CBNF95KRE3VMJ"
    },
    customChains: [
      {
        network: "alfajores",
        chainId: 44787,
        urls: {
          apiURL: "https://api-alfajores.celoscan.io/api",
          browserURL: "https://alfajores.celoscan.io"
        }
      }
    ]
  },
};
