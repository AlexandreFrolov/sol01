require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-truffle5");

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/<��� ������������� � Infura>',
      accounts: ['<��������� ����>'],
    },
    rinkeby2: {
      url: 'https://rinkeby.infura.io/v3/<��� ������������� � Infura>',
      accounts: ['<��������� ����>'],
    },
    alchemy: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/<��� ������������� � Alchemy>',
      accounts: ['<��������� ����>'],
    },
    alchemy2: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/<��� ������������� � Alchemy>',
      accounts: ['<��������� ����>'],
    },
    local: {
      url: 'http://localhost:8545',
      accounts: ['<��������� ����>'],
    },
  },
};
