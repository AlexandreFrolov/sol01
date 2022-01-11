var MyContract = artifacts.require("DrCoin");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};
