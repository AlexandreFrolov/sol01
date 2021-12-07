var account = process.argv[2];
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
web3.eth.getBalance(account)
.then(function (balance) {
  console.log('Account: ', account, 'balance: ', balance, 'wei, ', web3.utils.fromWei(balance, 'ether'), 'ether');
})
