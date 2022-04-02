const { expect } = require("chai");
const { ethers } = require("hardhat");
describe("DrCoin: Test token name, symbol, total supply and balance of account[0]", function () {
  let accounts;
  let DrCoin;
  let mydrcoin;
  beforeEach(async () => {
     accounts = await web3.eth.getAccounts();
     DrCoin = await ethers.getContractFactory("DrCoin");
     mydrcoin = await DrCoin.deploy();
     await mydrcoin.deployed();
  });
  it("Should return the token name, symbol, total supply and balance of account[0]", async function () {
      expect(await mydrcoin.name()).to.equal("Doctor Coin");
      expect(await mydrcoin.symbol()).to.equal("DRCOIN");
      expect(await mydrcoin.totalSupply()).to.equal("1000000000000000000000000");
      expect(await mydrcoin.balanceOf(accounts[0])).to.equal("1000000000000000000000000");
  });
  it("Should return balance 1000 for accounts[1]", async function () {
      const transferTx = await mydrcoin.transfer(accounts[1], 1000);
      await transferTx.wait();
      expect(await mydrcoin.balanceOf(accounts[1])).to.equal("1000");
  });
  it("Should return balance 200 for accounts[2]", async function () {
      const approveTx2 = await mydrcoin.approve(accounts[0], 500);
      await approveTx2.wait();
      const transferFromTx = await mydrcoin.transferFrom(accounts[0], accounts[2], 200);
      await transferFromTx.wait();
      expect(await mydrcoin.balanceOf(accounts[2])).to.equal("200");
  });
  it("Should burn 50 token from accounts[0]", async function () {
      var beforeBurn = BigInt(await mydrcoin.balanceOf(accounts[0]));
      console.log("balance0 Before Burn: " + beforeBurn);
      const burnTx = await mydrcoin.burn(50);
      await burnTx.wait();
      var afterBurn = BigInt(await mydrcoin.balanceOf(accounts[0]));
      console.log("balance0 After Burn: " + afterBurn);
      var delta = beforeBurn - afterBurn;
      console.log("Delta: " + delta);
      expect(BigInt(await mydrcoin.balanceOf(accounts[0]))).to.equal(BigInt(beforeBurn) - BigInt(50));
  });
});