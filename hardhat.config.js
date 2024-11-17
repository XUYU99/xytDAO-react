require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.27",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  allowUnlimitedContractSize: true,

  paths: {
    artifacts: "./src/artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    // sepolia: {
    //   url: SEPOLIA_RPC_URL,
    //   accounts: [PRIVATE_KEY0],
    //   chainId: 11155111,
    //   blockConfirmations: 6, //等待6个区块，即当一个交易被打包到一个区块中后，需要等待该交易被后续的 6 个区块确认后
    // },
  },
  namedAccounts: {
    deployer: {
      default: 0, //索引，localhost中会提供20个账户，选择第0个
    },
  },
};
