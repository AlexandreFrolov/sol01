// node call_contract_set.js HelloSol *******

var contract_to_deploy = process.argv[2];
var unlock_password = process.argv[3];

console.log('Contract script: ' + contract_to_deploy);
var abi_path = 'build/' + contract_to_deploy + '.abi';
var bin_path = 'build/' + contract_to_deploy + '.bin';

var abi;
var bin;
var myCoinbase;

var fs = require("fs");
var Web3 = require('web3');
const net = require('net');
const web3 = new Web3(new Web3.providers.IpcProvider("/home/developer/node1/geth.ipc", net));

var version = web3.version;
console.log('Web3 version: ' + version);

var contract_address = fs.readFileSync(contract_to_deploy + '.address').toString();
console.log('contract_address: ' + contract_address);

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
  abi = JSON.parse(fs.readFileSync(abi_path), 'utf8');
  bin = fs.readFileSync(bin_path);

  var myContract = new web3.eth.Contract(abi, contract_address);

myContract.methods.setValue(1234567890).send({from: myCoinbase})
.once('setValue transactionHash', (hash) => {
  console.log('hash: ' + hash);
})
.on('setValue confirmation', (confNumber) => {
  console.log('confNumber: ' + confNumber);
})
.on('receipt', (receipt) => {
  console.log(JSON.stringify(receipt, undefined, 2));
})
.then(function () {

myContract.methods.setString("Тестовая строка 1111111").send({from: myCoinbase})
.once('transactionHash', (hash) => {
  console.log('setString hash: ' + hash);
})
.on('confirmation', (confNumber) => {
  console.log('setString confNumber: ' + confNumber);
})
.on('receipt', (receipt) => {
  console.log(JSON.stringify(receipt, undefined, 2));
  process.exit(0);
})
})

})
.catch(function (error) {
  console.error(error);
});
