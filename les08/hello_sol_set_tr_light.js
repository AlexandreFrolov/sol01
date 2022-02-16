// node hello_sol_set_tr.js HelloSol 5777 ""
// node hello_sol_set_tr.js HelloSol 98760 ""
// node hello_sol_set_tr.js HelloSol 4 ""
const Web3 = require('web3')
const fs = require('fs')
const request = require('request')
const contract_name = process.argv[2];
const network_id = process.argv[3];
const unlock_password = process.argv[4];
const path = require('path');
const contractJSON = require(path.join(__dirname, 'HelloSol/build/contracts/' + contract_name + '.json'));
const decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
const contract_address = decoded[network_id].address;
const abi = contractJSON.abi;
console.log('contract_address: ' +  contract_address);
let web3;
if(network_id == 5777)
{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
}
else
{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

let myContract = new web3.eth.Contract(abi, contract_address);
let myAddress;

web3.eth.getAccounts()
.then(accList => {
  return accList;
})
.then(function (account) {
  console.log('account: ' +  account[0]);
  myAddress = account[0];
  return web3.eth.personal.unlockAccount(myAddress, unlock_password, 600)
})
.then(function (unlocked) {
  console.log('Unlocked: ' + unlocked);

  myContract.methods.setValue(307777309).send({from: myAddress})
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
    myContract.methods.setString("Тестовая строка 3777739").send({from: myAddress})
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
