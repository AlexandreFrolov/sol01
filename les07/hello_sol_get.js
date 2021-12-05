// node hello_sol_get.js HelloSol

var contract_name = process.argv[2];
var contract_address = process.argv[3];

var Web3 = require('web3');
var contract = require("@truffle/contract");
var path = require('path');

var provider = new Web3.providers.HttpProvider("http://localhost:9545");

var contractJSON = require(path.join(__dirname, 'HelloSol/build/contracts/' + contract_name + '.json'));
var contract = contract(contractJSON);
contract.setProvider(provider);

contract.deployed().then(function(instance) {
    return instance.getValue.call();
}).then(function(result) {
    console.log('getValue() returns: ' + result);
}, function(error) {
    console.log(error);
});

contract.deployed().then(function(instance) {
    return instance.getString.call();
}).then(function(result) {
    console.log('getString() returns: ' + result);
}, function(error) {
    console.log(error);
});

