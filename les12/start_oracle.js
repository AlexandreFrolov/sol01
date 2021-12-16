// node start_oracle.js USDRateOracle 5777

let Web3 = require('web3')
let fs = require('fs')
let request = require('request')

var contract_name = process.argv[2];
var network_id = process.argv[3];
var unlock_password = process.argv[4];
console.log('Contract script: ' + contract_name);

// /home/developer/sol01/les12/HelloSol/build/contracts

var path = require('path');
var contractJSON = require(path.join(__dirname, 'HelloSol/build/contracts/' + contract_name + '.json'));
console.log('Dirname: ' +  path.join(__dirname, 'HelloSol/build/contracts/' + contract_name + '.json'));



var decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
var contract_address = decoded[network_id].address;
var abi = contractJSON.abi;
console.log('contract_address: ' +  contract_address);

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:9545'))

var version = web3.version;
console.log('Web3 version: ' + version);

var myContract = new web3.eth.Contract(abi, contract_address);
var account

web3.eth.getAccounts()
.then(accList => {
  return accList;
})
.then(function (accounts) {
  account = accounts[0];
  console.log('Account: ' + account)

  console.log("Waiting for events on contract " + contract_address + ' ...')
  startEventListener(contract_address, account)

}, function(err) {
    console.log('Error: ' + err)
})
.catch(function (error) {
  console.error(error);
});


function startEventListener(address, account) {
    myContract.events.RateUpdate(
//    myContract.events.RateUpdate({fromBlock: 0, toBlock: 'latest'},
      function(error, event){
        console.log(">>> Event: " + event.event) })
        .on('data', (event) => {
            console.log('--- >>> Event RateUpdate fired')
//            console.log("RateUpdate event data: " + JSON.stringify(event, undefined, 2))
            RateUpdateHandler(address, account)
        })
        .on('changed', (event) => {
            console.log('============ > changed')
            console.log(event)
        })
        .on('error', console.error);
}


function RateUpdateHandler(address, account) {

let cbr_url = "https://www.cbr-xml-daily.ru/daily_json.js"
  request(cbr_url, function(error, response, body) {
    if(error)
      console.log("Request error: " + error)
    if(response.statusCode != 200)
      console.log("Error! CBR responce code: " + response.statusCode)

    let rates = JSON.parse(body)
    let rates_timestamp = rates.Timestamp
    let USD_rate = rates.Valute.USD.Value

    let unix_timestump = new Date(rates_timestamp)
    unix_timestump = unix_timestump.getTime()

    console.log('Rates Timestamp from CBR: ' + rates_timestamp)
    console.log('Rates Timestamp Unix Time format: ' + unix_timestump)

    console.log('USD Exchange Rate from CBR: ' + USD_rate)
    USD_rate = (USD_rate * 10000).toFixed()
    console.log('CBR USD Exchange Rate, fixed uint: ' + USD_rate)

    myContract.methods.saveNewRate(USD_rate, unix_timestump, rates_timestamp).send({from: account, gasPrice: 18000000000, gas: 5000000})
    .once('transactionHash', (hash) => {
      console.log('hash: ' + hash);
    })
    .on('confirmation', (confNumber) => {
      console.log('confNumber: ' + confNumber);
    })
    .on('receipt', (receipt) => {
      var ret_result = receipt.events.UpdatedRate.returnValues[0]
      console.log('Receipt result: ' + ret_result)
//        console.log('Receipt: ' + receipt)

      if (USD_rate == ret_result)
          console.log("=== > Successful update")
    })
    .on('error', console.error);
  })
}

