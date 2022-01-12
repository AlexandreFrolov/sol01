const express = require('express')
const app = express()
app.use(express.json());
const port = 3000

var Web3 = require('web3')
const net = require('net');
let fs = require('fs')
let request = require('request')
var path = require('path');

var contract_name = 'DrCoin';
var network_id = 4;
var unlock_password = 'ptktysq777888';

var account0 = '0x2b4218cc6d8fd1691395dc5223e201a56bbec512';


/*var contractJSON = require(path.join(__dirname, '../dcoin/build/contracts/' + contract_name + '.json'));
var decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
var contract_address = decoded[network_id].address;
var abi = contractJSON.abi;
*/

var abi_path = '/home/developer/sol01/les11/drcoin/DrCoin.abi';
var address_path = '/home/developer/sol01/les11/drcoin/DrCoin.address';

var abi = JSON.parse(fs.readFileSync(abi_path), 'utf8');
//console.log('contract abi: ' +  JSON.stringify(abi));
var contract_address = fs.readFileSync(address_path);
//console.log('contract address: ' +  contract_address);


const web3 = new Web3(new Web3.providers.IpcProvider("/home/developer/.rinkeby/geth.ipc", net));
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

let myContract = new web3.eth.Contract(abi, '0x53c08b3E83E2A01D51Caf668f10aB8Dc204AA180');
//myContract.options.address = '0x53c08b3E83E2A01D51Caf668f10aB8Dc204AA180';
//console.log('myContract options.address: ' +  myContract.options.address);

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/
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

// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/transfer -d '{"to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}'
app.post('/transfer/', (req, res) => {
  var address_to = req.body.to;
  var value = req.body.value;
  var rc;

//  startTransferEventListener(account0, address_to, value);

  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    console.log('Unlocked: ' + unlocked);
    myContract.methods.transfer(address_to, value).send({from: account0})
    .on('receipt', (receipt) => {
//      console.log(JSON.stringify(receipt, undefined, 2));
      myContract.methods.balanceOf(address_to).call({from: account0}, (error, result) =>
      {
        if(!error){
          rc = { 'rc':'ok', 'from': account0, 'to': address_to, 'balance': result };
        } else{
          rc = { 'rc':'err', 'err_msg': error };
          console.log(error);
        }
        let data = JSON.stringify(rc);
        res.type('json');
        res.send(data);
      })
    })
  })
  .catch((error) => {
    if(error) {
      rc = { 'rc':'err', 'err_msg': error };
      let data = JSON.stringify(rc);
      res.type('json');
      res.send(data);
      console.log(error)
    }
  })
});

// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/transfer-from -d '{"from":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512","to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}'
app.post('/transfer-from/', (req, res) => {
  var address_from = req.body.from;
  var address_to = req.body.to;
  var value = req.body.value;
  startTransferEventListener(address_from, address_to, value);
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    console.log('Unlocked: ' + unlocked);
    myContract.methods.transfer(address_to, value).send({from: account0})
    .on('receipt', (receipt) => {
//      console.log(JSON.stringify(receipt, undefined, 2));
      myContract.methods.balanceOf(address_to).call({from: account0}, (error, result) =>
      {
        if(!error){
          rc = { 'rc':'ok', 'from': account0, 'to': address_to, 'balance': result };
        } else{
          rc = { 'rc':'err', 'err_msg': error };
          console.log(error);
        }
        let data = JSON.stringify(rc);
        res.type('json');
        res.send(data);
      })
    })
  })
  .catch((error) => {
    rc = { 'rc':'err', 'err_msg': error };
    let data = JSON.stringify(rc);
    res.type('json');
    res.send(data);
    console.log(error)
  })
});

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/name
app.get('/name', (req, res) => {
  myContract.methods.name().call({from: account0}, (error, result) =>
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

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/symbol
app.get('/symbol', (req, res) => {
  myContract.methods.symbol().call({from: account0}, (error, result) =>
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

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/accounts
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

function startTransferEventListener(address_from, address_to, value) {
  myContract.events.Transfer(
    function(error, event){
      console.log(">>> Event: " + event.event)
    })
    .on('data', (event) => {
      TransferHandler(address_from, address_to, value)
    })
    .on('error', console.error);
}


function TransferHandler(address_from, address_to, value) {
  myContract.methods.balanceOf(address_from).call({from: account0}, (error, result) =>
  {
    if(!error){
      console.log('From: ' + address_from + ', balance: ' + result)
    } else{
      console.log(error);
    }
  })
  .then(function() {
    myContract.methods.balanceOf(address_to).call({from: account0}, (error, result) =>
    {
      if(!error){
        console.log('To: ' + address_to + ', balance: ' + result)
        console.log('Sent: ' + value)
      } else{
        console.log(error);
      }
    })
  })
}


app.listen(port, () => {
  console.log(`Doctor Coin app listening at http://localhost:${port}`)
})

