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
      from: "0x2b4218cc6d8fd1691395dc5223e201a56bbec512",
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
