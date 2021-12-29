const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DrCoin", function () {
  it("Should return the token name, symbol and total supply", async function () {

      let accounts = await web3.eth.getAccounts();

      const DrCoin = await ethers.getContractFactory("DrCoin");
      const mydrcoin = await DrCoin.deploy();
      await mydrcoin.deployed();

      expect(await mydrcoin.name()).to.equal("Doctor Coin");
      expect(await mydrcoin.symbol()).to.equal("DRCOIN");
      expect(await mydrcoin.totalSupply()).to.equal("1000000000000000000000000");

      expect(await mydrcoin.balanceOf(accounts[0])).to.equal("1000000000000000000000000");

      const transferTx = await mydrcoin.transfer(accounts[1], 1000);
      await transferTx.wait();
      expect(await mydrcoin.balanceOf(accounts[1])).to.equal("1000");

      var balance0 = await mydrcoin.balanceOf(accounts[0]);
      console.log("balance0: " + balance0);

      var balance1 = await mydrcoin.balanceOf(accounts[1]);
      console.log("balance1: " + balance1);

      var balance2 = await mydrcoin.balanceOf(accounts[2]);
      console.log("balance2: " + balance2);

      const approveTx2 = await mydrcoin.approve(accounts[0], 500);
      await approveTx2.wait();

      var approve1 = await mydrcoin.allowance(accounts[0], accounts[2]);
      console.log("approve1: " + approve1);

      const transferFromTx = await mydrcoin.transferFrom(accounts[0], accounts[2], 200);
      await transferFromTx.wait();
      expect(await mydrcoin.balanceOf(accounts[2])).to.equal("200");

      var balance2 = await mydrcoin.balanceOf(accounts[2]);
      console.log("balance2: " + balance2);

  });
});
