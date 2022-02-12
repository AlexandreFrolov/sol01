var account = process.argv[2];
var Web3 = require('web3')
const net = require('net');
const web3 = new Web3(new Web3.providers.IpcProvider("/home/developer/node1/geth.ipc", net));
web3.eth.getBalance(account)
.then(function (balance) {
  console.log('Account: ', account, 'balance: ', balance, 'wei, ', web3.utils.fromWei(balance, 'ether'), 'ether');
  process.exit(0);
})
