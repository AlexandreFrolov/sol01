// node hello_sol_set_tr.js HelloSol 5777 ""
// node hello_sol_set_tr.js HelloSol 98760 ""
// node hello_sol_set_tr.js HelloSol 4 ""
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

var web3;
if(network_id == 5777)
{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
}
else
{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

var version = web3.version;
console.log('Web3 version: ' + version);

let myContract = new web3.eth.Contract(abi, contract_address);
var myCoinbase;

web3.eth.getAccounts()
.then(accList => {
  return accList;
})
.then(function (accounts) {
  var balancePromeses = [];
  for(let i = 0; i < accounts.length; i++) {
    balancePromeses[i] = web3.eth.getBalance(accounts[i]);
  }

  Promise.all(balancePromeses).then(values => {
    for(let i = 0; i < values.length; i++) {
      console.log('Account: ', accounts[i], 'balance: ', values[i], 'wei, ', web3.utils.fromWei(values[i], 'ether'), 'ether');
    }
  });
  return accounts[0];
})
.then(function (account) {
  console.log('account: ' +  account);
  myCoinbase = account;
  return web3.eth.personal.unlockAccount(account, unlock_password, 600)
})
.then(function (unlocked) {
  console.log('Unlocked: ' + unlocked);

  myContract.methods.setValue(307777309).send({from: myCoinbase})
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
  myContract.methods.setString("Тестовая строка 3777739").send({from: myCoinbase})
  .once('transactionHash', (hash) => {
    console.log('setString hash: ' + hash);
  })
  .on('receipt', (receipt) => {
    console.log(JSON.stringify(receipt, undefined, 2));
  })
})
})
.catch(function (error) {
  console.error(error);
});
