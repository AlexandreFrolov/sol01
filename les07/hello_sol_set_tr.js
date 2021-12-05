// node hello_sol_set_tr.js HelloSol 5777 ""
let Web3 = require('web3')
let fs = require('fs')
let request = require('request')

var contract_name = process.argv[2];
var network_id = process.argv[3];
var unlock_password = process.argv[4];

console.log('Contract script: ' + contract_name);

var path = require('path');
var contractJSON = require(path.join(__dirname, 'HelloSol/build/contracts/' + contract_name + '.json'));

var decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
var contract_address = decoded[network_id].address;


var abi = contractJSON.abi;
console.log('contract_address: ' +  contract_address);

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

var version = web3.version;
console.log('Web3 version: ' + version);

let myContract = new web3.eth.Contract(abi, contract_address);

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

  myContract.methods.setValue(307309).send({from: myCoinbase})
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

  myContract.methods.setString("Test string 307309").send({from: myCoinbase})
  .once('transactionHash', (hash) => {
    console.log('setString hash: ' + hash);
  })
/*  .on('confirmation', (confNumber) => {
    console.log('setString confNumber: ' + confNumber);
  })
*/  .on('receipt', (receipt) => {
    console.log(JSON.stringify(receipt, undefined, 2));
  })
})

})
.catch(function (error) {
  console.error(error);
});
