// node call_oracle.js USDRateOracle 5777
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

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:9545'))
var version = web3.version;
console.log('Web3 version: ' + version);

let myContract = new web3.eth.Contract(abi, contract_address);

web3.eth.getAccounts()
.then(accList => {
  return accList;
})
.then(function (accounts) {
  account = accounts[0];

//  myContract.events.UpdatedRate({fromBlock: 0, toBlock: 'latest'}, function(error, event){ console.log(">>> " + event) })
  myContract.events.UpdatedRate(function(error, event){ console.log(">>> " + event) })
    .on('data', (log) => {
        console.log('--- >>> Event UpdatedRate fired >>>')
//          console.log("UpdatedRate event data: " + JSON.stringify(log, undefined, 2))
      myContract.methods.getRate().call({from: contract_address}, (error, result) =>
      {
        if(!error){
          console.log('getRate on UpdatedRate result: ' + result);
          console.log(JSON.stringify(result, undefined, 2));
          console.log('USD Rate: ' + result[0]/10000)

          let ux_time = parseInt(result[1])
          let str_timestump = new Date(ux_time)
          console.log('Formatted Timestump: ' + str_timestump)
          process.exit();
        } else{
           console.log(error);
        }
      });
    })
    .on('changed', (event) => {
        console.log('============ > changed')
        console.log(event)
    })
    .on('error', console.error);

    myContract.methods.requestNewRate().send({from: account, gas: 100000, gasPrice: "2000000000"})
    .once('transactionHash', (hash) => {
      console.log('hash: ' + hash);
    })
    .on('confirmation', (confNumber) => {
      console.log('confNumber: ' + confNumber);
    })
    .on('receipt', (receipt) => {
  //    console.log(JSON.stringify(receipt, undefined, 2));
    })
    .on('error', console.error);
  })
  .then(function (receipt) {
});

