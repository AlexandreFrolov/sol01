var from_address = process.argv[2];
var to_address = process.argv[3];
var unlock_password = process.argv[4];

var myCoinbase;

var fs = require("fs");
var Web3 = require('web3');

const net = require('net');

const web3 = new Web3(new Web3.providers.IpcProvider("/home/frolov/node1/geth.ipc", net));
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var version = web3.version;
console.log('Web3 version: ' + version);

web3.eth.getCoinbase()
.then(coinbase => {
  myCoinbase = coinbase;
  console.log('coinbase: ' + coinbase);
  return coinbase;
})
.then(function (account) {
  return web3.eth.personal.unlockAccount(account, unlock_password, 600)
})
.then(function (unlocked) {
  console.log('Unlocked: ' + unlocked);
  console.log('from_address: ' + from_address);
  console.log('to_address: ' + to_address);

web3.eth.sendTransaction({
    from: from_address,
    to: to_address,
    value: '1000000000000000'
})
.on('transactionHash', function(hash){
  console.log(hash);
})
.on('receipt', function(receipt){
  console.log(JSON.stringify(receipt, undefined, 2));
})
.on('confirmation', function(confirmationNumber, receipt){   console.log('sendTransaction confirmationNumber: ' + confirmationNumber); })
.on('error', console.error);
})
.then(function (hash) {
  console.log(hash);
})
.catch(function (error) {
  console.error(error);
});


