var MyContract = artifacts.require("HelloSol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};
