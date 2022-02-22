const hre = require("hardhat");

async function main() {
  const HelloSol = await hre.ethers.getContractFactory("HelloSol");
  const cHelloSol = await HelloSol.deploy();
  await cHelloSol.deployed();
  console.log("HelloSol deployed to:", cHelloSol.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
