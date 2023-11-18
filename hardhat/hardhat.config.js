require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ethers");

const deployer = {
  mnemonic: process.env.MNEMONIC || "test test test test test test test test test test test junk"
};

// const deployer = [""];

module.exports = {
  solidity: "0.8.20",
  networks: {
    gnosis: {
      url: "https://rpc.ankr.com/gnosis",
      accounts: deployer
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: deployer,
      chainId: 44787,
    },
    baseGoerli: {
      url: "https://goerli.base.org",
      accounts: deployer,
      chainId: 84531,
      gasMultiplier: 1.5
    },
    arbitrumGoerli: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
      chainId: 421613,
      accounts: deployer,
      gasMultiplier: 1.1
    }
  },
  etherscan: {
    apiKey: {
      alfajores: "9FYBMCJ8MJEF9Z6Y64MY9CBNF95KRE3VMJ",
      celo: "9FYBMCJ8MJEF9Z6Y64MY9CBNF95KRE3VMJ",
      baseGoerli: "29KPV447K5EVY6QTVKF4XXR87IUHSWX6DN",
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
