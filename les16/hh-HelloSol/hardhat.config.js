require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");
require("hardhat-gas-reporter");
//require('hardhat-storage-layout');

module.exports = {
//  solidity: "0.8.4",

  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
/*
      outputSelection: {
          "*": {
             "*": ["storageLayout"],
          },
      },      
*/    
    },
  },

  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
//    currency: 'RUB',
//    noColors: false,
    showTimeSpent: true,
    showMethodSig: true,
//    coinmarketcap: process.env.CMC_API_KEY,
  },

  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/bc74061445de46d0b7356a530f3ee9e5',
      accounts: ['0x889a2c455fc3a2fa41624e12b854f449fc2d7b9e73becec778a663058d097d7f'],
    },
    rinkeby2: {
      url: 'https://rinkeby.infura.io/v3/bc74061445de46d0b7356a530f3ee9e5',
      accounts: ['0x5109482b7101bdfcd84164b9748ff260383124ae76f46581e3eade5a60fc4ccd'],
    },
    alchemy: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/ufDTlrEoIyHd1Sxhg0_sllnAVud5Jtyf',
      accounts: ['0x889a2c455fc3a2fa41624e12b854f449fc2d7b9e73becec778a663058d097d7f'],
    },
    alchemy2: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/ufDTlrEoIyHd1Sxhg0_sllnAVud5Jtyf',
      accounts: ['0x5109482b7101bdfcd84164b9748ff260383124ae76f46581e3eade5a60fc4ccd'],
    },
    local: {
      url: 'http://localhost:8545',
      accounts: ['0x5109482b7101bdfcd84164b9748ff260383124ae76f46581e3eade5a60fc4ccd'],
    },
  },
};
