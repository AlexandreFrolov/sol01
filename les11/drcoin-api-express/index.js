const express = require('express')
const app = express()
app.use(express.json());
const port = 3000

const Web3 = require('web3')
const net = require('net');
const fs = require('fs')
const request = require('request')

const project_path='/home/developer/sol01/les11/drcoin-api/';
const network_id = 4;

const unlock_password_path = project_path + 'DrCoin.password';
const unlock_password = fs.readFileSync(unlock_password_path, 'utf8');

const account0_path = project_path + 'DrCoin.node.address';
const account0 = fs.readFileSync(account0_path, 'utf8');

const address_path = project_path + 'DrCoin.contract.address';
const contract_address = fs.readFileSync(address_path, 'utf8');

const abi_path = project_path + 'DrCoin.contract.abi';
const abi = JSON.parse(fs.readFileSync(abi_path), 'utf8');

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
    accounts:  { title: 'Get accounts list',   cmd: 'curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/accounts' },
    name:      { title: 'Get coin name',       cmd: 'curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/name' },
    symbol:    { title: 'Get coin symbol',     cmd: 'curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/symbol' },
    balanceof: { title: 'Get account balance', cmd: 'curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/balanceof -d \'{"account":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8"}\'' },
    transfer:  { title: 'Transfer coins',      cmd: 'curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/transfer -d \'{"to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}\''},
    transferfrom: { title: 'Transfer coins from account', cmd: 'curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/transferfrom -d \'{"from":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512","to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}\''},
    approve:   { title: 'Approve coin transfer from account', cmd: 'curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/approve -d \'{"spender":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "tokens":"5000"}\''},
    allowance: { title: 'Get allowance coin to transfer and burn', cmd: 'curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/allowance -d \'{ "owner":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512", "spender":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512"}\'' },
    burn:      { title: 'Burn coins from main account', cmd: 'curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/burn -d \'{ "tokens":"5000" }\'' },
    burnfrom:  { title: 'Burn coins from account', cmd: 'curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/burnfrom -d \'{ "from":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "tokens":"5000" }\''}
  };
  res.send(help_cmd);
})

// curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/balanceof -d '{"account":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8"}'
app.post('/balanceof/', (req, res) => {
  try {
    myContract.methods.balanceOf(req.body.account).call({from: account0}, function(error, result) {
      if(!error){
        rc = { rc:'ok', balance: result };
      } else{
        rc = { rc:'err', err_msg: error };
      }
      res.send(rc);
    })
  }
  catch (e) { res.send({ rc:'err', err_msg: e }); }
});

// curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/transfer -d '{"to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}'
app.post('/transfer/', (req, res) => {
  var rc;
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.transfer(req.body.to, req.body.value).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
  })
  .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
});

// curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/transferfrom -d '{"from":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512","to":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "value":"5000"}'
app.post('/transferfrom/', (req, res) => {
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.transferFrom(req.body.from, req.body.to, req.body.value).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
  })
  .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
});

// curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/approve -d '{"spender":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "tokens":"5000"}'
app.post('/approve/', (req, res) => {
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.approve(req.body.spender, req.body.tokens).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
  })
  .catch((error) => { res.send({ rc:'err', err_msg: error.message });  })
});

// curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/allowance -d '{ "owner":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512", "spender":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8"}'
// curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/allowance -d '{ "owner":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "spender":"0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512"}'
app.get('/allowance', (req, res) => {
  try {
    myContract.methods.allowance(req.body.owner, req.body.spender).call({from: account0}, (error, result) =>
    {
      res.send({"allowed":result});
    })
  }
  catch (e) { res.send({ rc:'err', err_msg: e.message }); }
})

// curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/burn -d '{ "tokens":"5000" }'
app.post('/burn/', (req, res) => {
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.burn(req.body.tokens).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
  })
  .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
});

// curl -X POST -H "Content-Type:application/json" http://127.0.0.1:3000/burnfrom -d '{ "from":"0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8", "tokens":"5000" }'
app.post('/burnfrom/', (req, res) => {
  web3.eth.personal.unlockAccount(account0, unlock_password, 600)
  .then(function (unlocked, accounts) {
    if(debug) { console.log('Unlocked: ' + unlocked); }
    myContract.methods.burnFrom(req.body.from, req.body.tokens).send({from: account0})
    .on('receipt', (receipt) => {
      if(debug) { console.log(JSON.stringify(receipt, undefined, 2)); }
      res.send({ rc:'ok'});
    })
    .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
  })
  .catch((error) => { res.send({ rc:'err', err_msg: error.message }); })
});


// curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/name
app.get('/name', (req, res) => {
  try {
    myContract.methods.name().call({from: account0}, (error, result) =>
    {
      let name = { name: result };
      res.send(name);
    })
  }
  catch (e) { res.send({ rc:'err', err_msg: e.message }); }
})

// curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/symbol
app.get('/symbol', (req, res) => {
  try {
    myContract.methods.symbol().call({from: account0}, (error, result) =>
    {
       let symbol = { symbol: result };
       res.send(symbol);
    })
  }
  catch (e) { res.send({ rc:'err', err_msg: e.message }); }
})

// curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/accounts
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
  .catch(function (error) { console.error(error); });
})

function startTransferEventListener() {
  myContract.events.Transfer()
    .on('data', (event) => {
      if(debug) {
        console.log(">>> Event: " + event.event);
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
        console.log(">>> Event: " + event.event);
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
        console.log(">>> Event: " + event.event);
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

