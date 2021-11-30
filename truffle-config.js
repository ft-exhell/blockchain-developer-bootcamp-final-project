require('dotenv').config();
const path = require("path");

const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  compilers: {
    solc: {
      version: "0.8.0"
    }
  },
  networks: {
    mainnet_fork: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*'
    },
    develop: {
      host: '127.0.0.1',
      network_id: '*',
      port: 7545
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(process.env.MNEMONIC, 'https://rinkeby.infura.io/v3/' + process.env.INFURA_API_KEY)
      },
      network_id: '4',
      gas: 5500000,
    },
  }
};
