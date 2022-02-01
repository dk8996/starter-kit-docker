require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "ganache-cli",
      port: 8545,
      network_id: "57771"
    },
    test: {
      host: "ganache-cli",
      port: 8545,
      network_id: "57771"
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

