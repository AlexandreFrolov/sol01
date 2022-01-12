const express = require('express')
const app = express()
const port = 3000

var Web3 = require('web3')
const net = require('net');
let fs = require('fs')
let request = require('request')
var path = require('path');

var contract_name = 'DrCoin';
var network_id = 4;
var unlock_password = 'ptktysq777888';

var contractJSON = require(path.join(__dirname, '../dcoin/build/contracts/' + contract_name + '.json'));
var decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
var contract_address = decoded[network_id].address;
var abi = contractJSON.abi;


const web3 = new Web3(new Web3.providers.IpcProvider("/home/developer/.rinkeby/geth.ipc", net));
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let myContract = new web3.eth.Contract(abi, contract_address);

app.get('/', (req, res) => {
  var help_cmd= {
    '/accounts': 'Get accounts list',
    '/name': 'Get coin name',
    '/symbol': 'Get coin symbol',
    '/transfer': 'Transfer coins'
  };
  let data = JSON.stringify(help_cmd);
  res.type('json');
  res.send(data);
})

// http://192.168.0.71:3000/transfer/0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512-0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8
app.get('/transfer/:from-:to', (req, res) => {
  var address_from = req.params.from;
  var address_to = req.params.to;

  web3.eth.personal.unlockAccount(address_from, unlock_password, 600)
  .then(function (unlocked, accounts) {
    console.log('Unlocked: ' + unlocked);

    myContract.methods.transfer(address_to, 1000).send({from: address_from})
    .once('transfer transactionHash', (hash) => {
      console.log('hash: ' + hash);
    })
    .on('transfer confirmation', (confNumber) => {
      console.log('confNumber: ' + confNumber);
    })
    .on('receipt', (receipt) => {
      console.log(JSON.stringify(receipt, undefined, 2));
      myContract.methods.balanceOf(address_to).call({from: contract_address}, (error, result) =>
      {
        if(!error){
          console.log('address_to: ' + result);

          let name = { 'From': address_from, 'To': address_to, 'New dst balance': result };
          let data = JSON.stringify(name);
          res.type('json');
          res.send(data);
        } else{
          console.log(error);
        }
      })
    })
  })
})


app.get('/name', (req, res) => {
  myContract.methods.name().call({from: contract_address}, (error, result) =>
  {
     if(!error){
       let name = { 'Coin Name': result };
       let data = JSON.stringify(name);
       res.type('json');
       res.send(data);
     } else{
       console.log(error);
     }
  });
})

app.get('/symbol', (req, res) => {
  myContract.methods.symbol().call({from: contract_address}, (error, result) =>
  {
     if(!error){
       let name = { 'Coin Symbol': result };
       let data = JSON.stringify(name);
       res.type('json');
       res.send(data);
     } else{
       console.log(error);
     }
  });
})


app.get('/accounts', (req, res) => {

  web3.eth.getAccounts()
  .then(accList => {
    return accList;
  })
  .then(function (accounts) {
    var balancePromeses = [];
    for(let i = 0; i < accounts.length; i++) {
      balancePromeses[i] = web3.eth.getBalance(accounts[i]);
    }
    Promise.all(balancePromeses).then(values => {
      var balance = '';
      var data = [];
      for(let i = 0; i < values.length; i++) {
        balance = web3.utils.fromWei(values[i], 'ether');
        data.push({
          Account: accounts[i],
          Balance: balance
        });
      }
      res.json(data);
    });
  })
  .catch(function (error) {
    console.error(error);
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

