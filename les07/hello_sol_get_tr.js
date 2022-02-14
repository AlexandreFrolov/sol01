// node hello_sol_get_tr.js HelloSol 5777
const Web3 = require('web3')
const fs = require('fs')
const request = require('request')
const contract_name = process.argv[2];
const network_id = process.argv[3];
const path = require('path');
const contractJSON = require(path.join(__dirname, 'HelloSol/build/contracts/' + contract_name + '.json'));
const decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
const contract_address = decoded[network_id].address;
const abi = contractJSON.abi;
console.log('contract_address: ' +  contract_address);

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

let myContract = new web3.eth.Contract(abi, contract_address);
myContract.methods.getValue().call({from: contract_address}, (error, result) =>
{
   if(!error){
     console.log('getValue result: ' + result);
     console.log(JSON.stringify(result, undefined, 2));
   } else{
     console.log(error);
   }
})
.then(function () {
  myContract.methods.getString().call({from: contract_address}, (error, result) =>
  {
     if(!error){
       console.log('getString result: ' + result);
     } else{
       console.log(error);
     }
  });
})
.catch(function (error) {
  console.error(error);
});
