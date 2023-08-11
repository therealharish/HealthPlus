// require("dotenv").config();
// const HDWalletProvider = require("@truffle/hdwallet-provider");
// const { INFURA_API_KEY, MNEMONIC } = process.env;

module.exports = {
  networks: {
    // sepolia: {
    //   provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_KEY),
    //   network_id: "11155111",
    //   gas: 4465030,
    // },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
  },
  compilers: {
    solc: {
      version: '0.8.3',
      parser: 'solcjs'
    }
  },
  contracts_build_directory: "../client/src/contracts",
}