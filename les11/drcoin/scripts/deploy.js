// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
var fs = require("fs");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  await hre.run('compile');

  // We get the contract to deploy

  var contract_name="DrCoin";
  const DrCoin = await hre.ethers.getContractFactory("DrCoin");
  const mydrcoin = await DrCoin.deploy();
  await mydrcoin.deployed();

  console.log("DrCoin deployed to:", mydrcoin.address);
  fs.writeFileSync("/home/developer/sol01/les11/drcoin/DrCoin.address", mydrcoin.address);

  var path = require('path');
  var contractJSON = require(path.join(__dirname, '../artifacts/contracts/DrCoin.sol/DrCoin.json'));
//  var contractJSON = require('/home/developer/sol01/les11/drcoin/artifacts/contracts/DrCoin.sol/DrCoin.json');

  var abi = contractJSON.abi;
//  console.log('contract abi: ' +  JSON.stringify(abi));
  fs.writeFileSync("DrCoin.abi", JSON.stringify(abi));

  var tokenName = await mydrcoin.name();
  var tokenSymbol = await mydrcoin.symbol();
  var totalTokens = await mydrcoin.totalSupply();

  console.log("ERC-20 token name: " + tokenName);
  console.log("ERC-20 token symbol: " + tokenSymbol);
  console.log("Total Supply: " + totalTokens + " " + tokenSymbol);

  let accounts;
  accounts = await web3.eth.getAccounts();

  console.log(accounts);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
