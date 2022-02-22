const hre = require("hardhat");
const fs = require("fs");

async function main() {
  await hre.run('compile');

  const contract_name="DrNFT";
  const project_path='/home/developer/sol01/les14/drnft/';

  const DrNFT = await hre.ethers.getContractFactory("DrNFT");
  const mydrnft = await DrNFT.deploy();
  await mydrnft.deployed();

  console.log("DrNFT deployed to:", mydrnft.address);
  fs.writeFileSync(project_path + "DrNFT.contract.address", mydrnft.address);

  const contractJSON = require(project_path + 'artifacts/contracts/DrNFT.sol/DrNFT.json');
  fs.writeFileSync(project_path + "DrNFT.contract.abi", JSON.stringify(contractJSON.abi));

  const tokenName = await mydrnft.name();
  const tokenSymbol = await mydrnft.symbol();

  console.log("ERC-721 token name: " + tokenName);
  console.log("ERC-721 token symbol: " + tokenSymbol);

  const accounts = await web3.eth.getAccounts();
  fs.writeFileSync(project_path + "DrNFT.node.address", accounts[0]);
  console.log(accounts);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});
