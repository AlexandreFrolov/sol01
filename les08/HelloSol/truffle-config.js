module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    live: {
      host: "127.0.0.1",
      port: 8545,
      network_id: 98760,
      gas: 5000000
    },
  rinkeby: {
      host: "localhost",
      port: 8545,
      from: "0xaf3cc1db3ef0dce4c1355e87ce11bb1c68fb0ed4",
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    }
},
  mocha: {
  },
  compilers: {
    solc: {
      version: "0.8.10",
    }
  },
};
