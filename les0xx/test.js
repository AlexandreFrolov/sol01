async function acc() {
    var acc_list = await web3.eth.getAccounts();
    console.log(acc_list);
}

var Web3 = require('web3')
const net = require('net');
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var web3 = new Web3(new Web3.providers.IpcProvider("/home/frolov/node1/geth.ipc", net));
//var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));
web3.eth.getAccounts().then( accounts => {
  console.log(accounts);
  console.log(web3.currentProvider.constructor.name);
  process.exit(0);
//  process.on('exit', function() { process.exit(1); });

//process.exitCode = 1;
//throw new Error("my module xx condition failed");
} )
//.then(process.exit(0));


//web3.currentProvider.connection.close();


//acc();
