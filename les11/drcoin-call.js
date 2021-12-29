// node hello_sol_set_tr.js DrCoin 4 ""
let Web3 = require('web3')
let fs = require('fs')
let request = require('request')

var contract_name = process.argv[2];
var network_id = process.argv[3];
var unlock_password = process.argv[4];

console.log('Contract script: ' + contract_name);

var path = require('path');
var contractJSON = require(path.join(__dirname, 'drcoin/artifacts/contracts/DrCoin.sol/' + contract_name + '.json'));

console.log(path.join(__dirname, 'drcoin/artifacts/contracts/DrCoin.sol/' + contract_name + '.json'));


//var contractJSON = '/home/developer/sol01/les11/drcoin/artifacts/contracts/DrCoin.sol/DrCoin.json';
//var parsed = JSON.stringify(contractJSON);

var abi = contractJSON.abi;
console.log('contract abi: ' +  abi);


//var decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
//var contract_address = decoded[network_id].address;
//console.log('contract_address: ' +  contract_address);

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




