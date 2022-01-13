const express = require('express')
const app = express()
app.use(express.json());
const port = 3000

const Web3 = require('web3')
const net = require('net');
const fs = require('fs')
const request = require('request')
const path = require('path');

const contract_name = 'DrCoin';
const network_id = 4;
const unlock_password = '*******';

const account0 = '0x2b4218cc6d8fd1691395dc5223e201a56bbec512';
//let contract_address = '0x53c08b3E83E2A01D51Caf668f10aB8Dc204AA180';


/*var contractJSON = require(path.join(__dirname, '../dcoin/build/contracts/' + contract_name + '.json'));
var decoded = JSON.parse(JSON.stringify(contractJSON.networks, undefined, 2));
var contract_address = decoded[network_id].address;
var abi = contractJSON.abi;
*/

const abi_path = '/home/developer/sol01/les11/drcoin/DrCoin.abi';
const address_path = '/home/developer/sol01/les11/drcoin/DrCoin.address';

const abi = JSON.parse(fs.readFileSync(abi_path), 'utf8');
const contract_address = fs.readFileSync(address_path, 'utf8');

let debug=0;
if (process.env.NODE_ENV != "production") { debug=1; }

const web3 = new Web3(new Web3.providers.IpcProvider("/home/developer/.rinkeby/geth.ipc", net));
//const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const myContract = new web3.eth.Contract(abi, contract_address, { from: account0, gasPrice: '20000000000' } );

if(debug) {
//  console.log('contract abi: ' +  JSON.stringify(abi));
  console.log('contract address: ' +  contract_address);
  console.log('myContract options.address: ' +  myContract.options.address);
}

startTransferEventListener();
startApprovalEventListener();
startBurnEventListener();

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/
app.get('/', (req, res) => {
  var help_cmd= {
    accounts:   '/accounts - get accounts list',
    name: '/name - get coin name',
    symbol: '/symbol - get coin symbol',
    transfer: '/transfer - transfer coins'
  };
  res.send(help_cmd);
})


// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/balance-of -d '{"account":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8"}'
app.post('/balance-of/', (req, res) => {
  var account = req.body.account;
  try {
    myContract.methods.balanceOf(account).call({from: account0}, function(error, result) {
      if(!error){
        rc = { rc:'ok', balance: result };
      } else{
        rc = { rc:'err', err_msg: error };
      }
      res.send(rc);
    })
  }
  catch (e) {
    res.send({ rc:'err', err_msg: e });
  }
});


// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/transfer -d '{"to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}'
app.post('/transfer/', (req, res) => {
  var address_to = req.body.to;
  var value = req.body.value;
  var rc;
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.transfer(address_to, value).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => {
      if(error) {
        res.send({ rc:'err', err_msg: error.message });
      }
    })
  })
  .catch((error) => {
    if(error) {
      res.send({ rc:'err', err_msg: error.message });
    }
  })
});

// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/transfer-from -d '{"from":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512","to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}'
app.post('/transfer-from/', (req, res) => {
  var address_from = req.body.from;
  var address_to = req.body.to;
  var value = req.body.value;
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.transfer(address_to, value).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => {
      if(error) {
        res.send({ rc:'err', err_msg: error.message });
      }
    })
  })
  .catch((error) => {
    res.send({ rc:'err', err_msg: error.message });
  })
});

// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/approve -d '{"spender":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "tokens":"5000"}'
app.post('/approve/', (req, res) => {
  var spender = req.body.spender;
  var tokens = req.body.tokens;
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.approve(spender, tokens).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => {
      if(error) {
        res.send({ rc:'err', err_msg: error.message });
      }
    })
  })
  .catch((error) => {
    res.send({ rc:'err', err_msg: error.message });
  })
});


// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/burn -d '{ "tokens":"5000" }'
app.post('/burn/', (req, res) => {
  var tokens = req.body.tokens;
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.burn(tokens).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => {
      if(error) {
        res.send({ rc:'err', err_msg: error.message });
      }
    })
  })
  .catch((error) => {
    res.send({ rc:'err', err_msg: error.message });
  })
});

// curl -X POST -H "Content-Type:application/json" http://192.168.0.71:3000/burn-from -d '{ "from":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "tokens":"5000" }'
app.post('/burn-from/', (req, res) => {
  var tokens = req.body.tokens;
  var from = req.body.from;
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.burnFrom(from, tokens).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => {
      if(error) {
        res.send({ rc:'err', err_msg: error.message });
      }
    })
  })
  .catch((error) => {
    res.send({ rc:'err', err_msg: error.message });
  })
});

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/allowance -d '{ "owner":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512", "spender":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8"}'
// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/allowance -d '{ "owner":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "spender":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512"}'
app.get('/allowance', (req, res) => {
  var owner = req.body.owner;
  var spender = req.body.spender;
  try {
    myContract.methods.allowance(owner, spender).call({from: account0}, (error, result) =>
    {
      res.send({"allowed":result});
    })
  }
  catch (e) {
    res.send({ rc:'err', err_msg: e.message });
  }
})

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/name
app.get('/name', (req, res) => {
  try {
    myContract.methods.name().call({from: account0}, (error, result) =>
    {
      let name = { name: result };
      res.send(name);
    })
  }
  catch (e) {
    res.send({ rc:'err', err_msg: e.message });
  }
})

// curl -X GET -H "Content-Type:application/json" http://192.168.0.71:3000/symbol
app.get('/symbol', (req, res) => {
  try {
    myContract.methods.symbol().call({from: account0}, (error, result) =>
    {
       let symbol = { symbol: result };
       res.send(symbol);
    })
  }
  catch (e) {
    res.send({ rc:'err', err_msg: e.message });
  }
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

function startTransferEventListener() {
  myContract.events.Transfer()
    .on('data', (event) => {
      if(debug) {
        console.log(">>> Detected Event: " + event.event)
        console.log(event.returnValues);
      }
      TransferHandler(event.returnValues)
    })
    .on('error', console.error);
}

function startApprovalEventListener() {
  myContract.events.Approval()
    .on('data', (event) => {
      if(debug) {
        console.log(">>> Detected Event: " + event.event)
        console.log(event.returnValues);
      }
      ApprovalHandler(event.returnValues)
    })
    .on('error', console.error);
}

function startBurnEventListener() {
  myContract.events.Burn()
    .on('data', (event) => {
      if(debug) {
        console.log(">>> Detected Event: " + event.event)
        console.log(event.returnValues);
      }
      BurnHandler(event.returnValues)
    })
    .on('error', console.error);
}

function TransferHandler(ev_data) {
  console.log('Transfer Event Handler: Sent ' + ev_data.tokens + ' DRCOIN from: ' + ev_data.from + ' to: ' + ev_data.to)
}

function ApprovalHandler(ev_data) {
  console.log('Approval Event Handler: Approve send ' + ev_data.tokens + ' DRCOIN from spender: ' + ev_data.spender + ', tokenOwner: ' + ev_data.tokenOwner)
}

function BurnHandler(ev_data) {
  console.log('Burn Event Handler: Burn ' + ev_data.value + ' DRCOIN from: ' + ev_data.from)
}

app.listen(port, () => {
  console.log(`Doctor Coin app listening at http://localhost:${port}`)
})

