const hre = require("hardhat");
const fs = require("fs");

async function main() {
  await hre.run('compile');

  const contract_name="DrCoin";
  const project_path='/home/developer/sol01/les16/drcoin-api/';

  const DrCoin = await hre.ethers.getContractFactory("DrCoin");
  await hre.storageLayout.export();
  const mydrcoin = await DrCoin.deploy();
  await mydrcoin.deployed();

  console.log("DrCoin deployed to:", mydrcoin.address);
  fs.writeFileSync(project_path + "DrCoin.contract.address", mydrcoin.address);

  const contractJSON = require(project_path + 'artifacts/contracts/DrCoin.sol/DrCoin.json');
  fs.writeFileSync(project_path + "DrCoin.contract.abi", JSON.stringify(contractJSON.abi));

  const tokenName = await mydrcoin.name();
  const tokenSymbol = await mydrcoin.symbol();
  const totalTokens = await mydrcoin.totalSupply();

  console.log("ERC-20 token name: " + tokenName);
  console.log("ERC-20 token symbol: " + tokenSymbol);
  console.log("Total Supply: " + totalTokens + " " + tokenSymbol);

  const accounts = await web3.eth.getAccounts();
  fs.writeFileSync(project_path + "DrCoin.node.address", accounts[0]);
  console.log(accounts);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
