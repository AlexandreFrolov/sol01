// node call_contract_get_promise.js HelloSol

var contract_to_deploy = process.argv[2];

console.log('Contract script: ' + contract_to_deploy);
var abi_path = 'build/' + contract_to_deploy + '.abi';
var bin_path = 'build/' + contract_to_deploy + '.bin';

var abi;
var bin;
var myCoinbase;

var fs = require("fs");
var Web3 = require('web3');
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const net = require('net');
const web3 = new Web3(new Web3.providers.IpcProvider("/home/frolov/node1/geth.ipc", net));


var version = web3.version;
var my_contract;
console.log('Web3 version: ' + version);

var contract_address = fs.readFileSync(contract_to_deploy + '.address').toString();
console.log('contract_address: ' + contract_address);

web3.eth.getCoinbase()
.then(coinbase => {
  myCoinbase = coinbase;
  console.log('coinbase: ' + coinbase);
  return coinbase;
})
.then(function () {
  abi = JSON.parse(fs.readFileSync(abi_path), 'utf8');
  bin = fs.readFileSync(bin_path);

  my_contract = new web3.eth.Contract(abi, contract_address);
  return my_contract;
})
.then(function () {
  my_contract.methods.getValue().call({from: contract_address}, (error, result) =>
  {
     if(!error){
       console.log('getValue result: ' + result);
     } else{
       console.log(error);
     }
  });
})
.then(function () {
  my_contract.methods.getString().call({from: contract_address}, (error, result) =>
  {
     if(!error){
       console.log('getString result: ' + result);
       process.exit(0);
     } else{
       console.log(error);
     }
  });
})
.catch(function (error) {
  console.error(error);
});
