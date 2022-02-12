// node contract_get_balance.js HelloSol
var contract_to_deploy = process.argv[2];

console.log('Contract script: ' + contract_to_deploy);
var abi_path = 'build/' + contract_to_deploy + '.abi';
var abi;
var myCoinbase;

var fs = require("fs");
var Web3 = require('web3');
const net = require('net');
const web3 = new Web3(new Web3.providers.IpcProvider("/home/developer/node1/geth.ipc", net));

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
  my_contract = new web3.eth.Contract(abi, contract_address);
  return my_contract;
})
.then(function () {
  my_contract.methods.getBalance().call({from: contract_address}, (error, result) =>
  {
     if(!error){
       console.log('getBalance result: ' + result);
       process.exit(0);
     } else{
       console.log(error);
     }
  })
})
.catch(function (error) {
  console.error(error);
});
