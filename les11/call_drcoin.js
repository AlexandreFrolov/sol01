// node call_drcoin.js DrCoin 5777
// node call_drcoin.js DrCoin 98760
// node call_drcoin.js DrCoin 4
let Web3 = require('web3')
let fs = require('fs')
let request = require('request')

var contract_name = process.argv[2];
var network_id = process.argv[3];
var unlock_password = process.argv[4];

console.log('Contract script: ' + contract_name);

var path = require('path');
var contractJSON = require(path.join(__dirname, 'dcoin/build/contracts/' + contract_name + '.json'));
var decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
var contract_address = decoded[network_id].address;
var abi = contractJSON.abi;

var accounts0;
var accounts1 = "0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8";
var accounts2;

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

myContract.methods.name().call({from: contract_address}, (error, result) =>
{
   if(!error){
     console.log('name result: ' + result);
     console.log(JSON.stringify(result, undefined, 2));
   } else{
     console.log(error);
   }
});

myContract.methods.symbol().call({from: contract_address}, (error, result) =>
{
   if(!error){
     console.log('symbol result: ' + result);
   } else{
     console.log(error);
   }
});

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
  return accounts;
})
.then(function (accounts) {
  console.log('account: ' +  accounts[0]);
  myCoinbase = accounts[0];
  accounts0 = accounts[0];
//  accounts1 = accounts[1];
  accounts2 = accounts[2];
  return web3.eth.personal.unlockAccount(accounts[0], unlock_password, 600)
})
.then(function (unlocked, accounts) {
  console.log('Unlocked: ' + unlocked);

  myContract.methods.transfer(accounts1, 1000).send({from: myCoinbase})
  .once('transfer transactionHash', (hash) => {
    console.log('hash: ' + hash);
  })
  .on('transfer confirmation', (confNumber) => {
    console.log('confNumber: ' + confNumber);
  })
  .on('receipt', (receipt) => {
    console.log(JSON.stringify(receipt, undefined, 2));

    myContract.methods.balanceOf(accounts1).call({from: contract_address}, (error, result) =>
    {
      if(!error){
        console.log('accounts1: ' + result);
      } else{
        console.log(error);
      }
    })
  })
})
.catch(function (error) {
  console.error(error);
});

