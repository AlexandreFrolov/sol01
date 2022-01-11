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
      from: "0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512",
      network_id: 4,
      gas: 4612388
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

