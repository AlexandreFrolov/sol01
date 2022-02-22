require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/<Ваш идентификатор в Infura>',
      accounts: ['<Приватный ключ>'],
    },
    rinkeby2: {
      url: 'https://rinkeby.infura.io/v3/<Ваш идентификатор в Infura>',
      accounts: ['<Приватный ключ>'],
    },
    alchemy: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/<Ваш идентификатор в Alchemy>',
      accounts: ['<Приватный ключ>'],
    },
    alchemy2: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/<Ваш идентификатор в Alchemy>',
      accounts: ['<Приватный ключ>'],
    },
    local: {
      url: 'http://localhost:8545',
      accounts: ['<Приватный ключ>'],
    },
  },
};
