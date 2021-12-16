var MyContract = artifacts.require("USDRateOracle");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(MyContract);
};

