// node deploy_contract_promise.js HelloSol *******

var contract_to_deploy = process.argv[2];
var unlock_password = process.argv[3];

console.log('Contract Deploy script: ' + contract_to_deploy);

var solc_cmd ='solc --bin --abi ' + contract_to_deploy + '.sol -o build --overwrite';
var abi_path = 'build/' + contract_to_deploy + '.abi';
var bin_path = 'build/' + contract_to_deploy + '.bin';

var abi;
var bin;
var contractObject;
var myCoinbase;

const { exec } = require('child_process');
exec(solc_cmd, (err, stdout, stderr) => {
  if(err) {
    console.log(`exec error: ${err}`);
    return;
  }
});

var fs = require("fs");
var Web3 = require('web3');
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
//var web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));
const net = require('net');
const web3 = new Web3(new Web3.providers.IpcProvider("/home/frolov/node1/geth.ipc", net));


web3.eth.getCoinbase()
.then(coinbase => {
  myCoinbase = coinbase;
  return coinbase;
})
.then(function (account) {
  return web3.eth.personal.unlockAccount(account, unlock_password, 600)
})
.then(function (unlocked) {
  console.log('Unlocked: ' + unlocked);

  abi = JSON.parse(fs.readFileSync(abi_path), 'utf8');
  bin = fs.readFileSync(bin_path);

  return web3.eth.estimateGas({ data: '0x' + bin })
})
.then(function (gas) {
  console.log('Gas estimation: ' + gas);
  contractObject = new web3.eth.Contract(abi, myCoinbase, {
    from: myCoinbase, gas: 4700000, data: '0x'+ bin
  });

  contractObject.deploy({
      data: '0x'+ bin
  })
  .send({
      from: myCoinbase,
      gas: 4700000,
      gasPrice: '8000000000'
  }, (error, transactionHash) => { console.log('transactionHash: ' + transactionHash) })
  .on('error', (error) => { console.log('Error: ' + error) })
  .on('transactionHash', (transactionHash) => { console.log('on transactionHash: ' + transactionHash) })
  .on('receipt', (receipt) => {
     console.log('contractAddress: ' + receipt.contractAddress)
  })
/*  .on('confirmation', (confirmationNumber, receipt) => {
    console.log('on confirmation: ' + confirmationNumber)
  })
*/  .then((newContractInstance) => {
    console.log('Contract Deployed');
    console.log('coinbase: ' + myCoinbase);
    console.log('New Contract address: ' + newContractInstance.options.address);

    fs.writeFileSync(contract_to_deploy + ".address", newContractInstance.options.address);
    process.exit(0);
  });
})
.catch(function (error) {
  console.error(error);
});
