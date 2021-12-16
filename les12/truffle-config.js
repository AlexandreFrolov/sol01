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
