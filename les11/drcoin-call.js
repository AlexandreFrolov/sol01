//node drcoin-call.js DrCoin 4 "***"
let Web3 = require('web3')
let fs = require('fs')
let request = require('request')

async function main() {

  var contract_name = process.argv[2];
  var network_id = process.argv[3];
  var unlock_password = process.argv[4];

  console.log('Contract script: ' + contract_name);

  var abi_path = '/home/developer/sol01/les11/drcoin/DrCoin.abi';
  var address_path = '/home/developer/sol01/les11/drcoin/DrCoin.address';

  var abi = JSON.parse(fs.readFileSync(abi_path), 'utf8');
  //console.log('contract abi: ' +  JSON.stringify(abi));
  var contract_address = fs.readFileSync(address_path);
  console.log('contract address: ' +  contract_address);


  var web3;
  if(network_id == 5777)
  {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
  }
  else
  {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  var version = web3.version;
  console.log('Web3 version: ' + version);

  let drCoinContract = new web3.eth.Contract(abi, contract_address);

  var accounts;
  accounts = await web3.eth.getAccounts();
  console.log('Account 0: ' + accounts[0]);
  console.log('Account 1: ' + accounts[1]);
  console.log('Account 2: ' + accounts[2]);

  console.log('contract address: ' +  contract_address);

  var error;
  var result;
  var name = await drCoinContract.methods.name.call();
  console.log('name: ' + name);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });