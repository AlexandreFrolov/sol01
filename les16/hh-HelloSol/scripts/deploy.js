const hre = require("hardhat");

async function main() {


  const HelloSol = await hre.ethers.getContractFactory("HelloSol");
  const cHelloSol = await HelloSol.deploy();
  await cHelloSol.deployed();
  console.log("HelloSol deployed to:", cHelloSol.address);

  const IntOptimization = await hre.ethers.getContractFactory("IntOptimization");
  const cIntOptimization = await IntOptimization.deploy();
  await cIntOptimization.deployed();
  console.log("IntOptimization deployed to:", cIntOptimization.address);

  await hre.storageLayout.export();

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
