// node hello_sol_set_tr.js HelloSol 5777 ""
let Web3 = require('web3')
let fs = require('fs')
let request = require('request')

const contract_name = process.argv[2];
const network_id = process.argv[3];
const unlock_password = process.argv[4];
const path = require('path');
const contractJSON = require(path.join(__dirname, 'HelloSol/build/contracts/' + contract_name + '.json'));
const decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
const contract_address = decoded[network_id].address;
const abi = contractJSON.abi;
console.log('contract_address: ' +  contract_address);
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
let myContract = new web3.eth.Contract(abi, contract_address);

web3.eth.getAccounts()
.then(accounts => {
  myAddress = accounts[0];
  return myAddress;
})
.then(function (account) {
  return web3.eth.personal.unlockAccount(account, unlock_password, 600)
})
.then(function (unlocked) {
  console.log('Unlocked: ' + unlocked);
  myContract.methods.setValue(307309).send({from: myAddress})
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
    myContract.methods.setString("Тестовая строка 3739").send({from: myAddress})
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
