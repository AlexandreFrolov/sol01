// node hello_sol_get_tr.js HelloSol 5777
let Web3 = require('web3')
let fs = require('fs')
let request = require('request')

var contract_name = process.argv[2];
var network_id = process.argv[3];

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
.then(function () {

  myContract.methods.getValue().call({from: contract_address}, (error, result) =>
  {
     if(!error){
       console.log('getValue result: ' + result);
       console.log(JSON.stringify(result, undefined, 2));
     } else{
       console.log(error);
     }
  });

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
