const express = require('express')
const app = express()
const port = 3000

var Web3 = require('web3')
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const net = require('net');
const web3 = new Web3(new Web3.providers.IpcProvider("/home/frolov/node1/geth.ipc", net));

app.get('/', (req, res) => {

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
      var txt = '';
      var balance = '';
      for(let i = 0; i < values.length; i++) {
        balance = web3.utils.fromWei(values[i], 'ether');
        txt = txt + 'Account: ' + accounts[i] + ', balance = ' + balance + ' Ether' + '<br>';
      }
      res.send(txt)
  //    process.exit(0);
    });
  })
  .catch(function (error) {
    console.error(error);
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

