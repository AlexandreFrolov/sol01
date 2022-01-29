const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DrCoin: Test token name, symbol, total supply and balance of account[0]", function () {
  it("Should return the token name, symbol, total supply and balance of account[0]", async function () {
      let accounts = await web3.eth.getAccounts();
      const DrCoin = await ethers.getContractFactory("DrCoin");
      const mydrcoin = await DrCoin.deploy();
      await mydrcoin.deployed();
      expect(await mydrcoin.name()).to.equal("Doctor Coin");
      expect(await mydrcoin.symbol()).to.equal("DRCOIN");
      expect(await mydrcoin.totalSupply()).to.equal("1000000000000000000000000");
      expect(await mydrcoin.balanceOf(accounts[0])).to.equal("1000000000000000000000000");
  });
});

describe("DrCoin: Test transfer", function () {
  it("Should return balance 1000 for accounts[1]", async function () {
      let accounts = await web3.eth.getAccounts();
      const DrCoin = await ethers.getContractFactory("DrCoin");
      const mydrcoin = await DrCoin.deploy();
      await mydrcoin.deployed();
      const transferTx = await mydrcoin.transfer(accounts[1], 1000);
      await transferTx.wait();
      expect(await mydrcoin.balanceOf(accounts[1])).to.equal("1000");
  });
});

describe("DrCoin: Test transferFrom", function () {
  it("Should return balance 200 for accounts[2]", async function () {
      let accounts = await web3.eth.getAccounts();
      const DrCoin = await ethers.getContractFactory("DrCoin");
      const mydrcoin = await DrCoin.deploy();
      await mydrcoin.deployed();
      const approveTx2 = await mydrcoin.approve(accounts[0], 500);
      await approveTx2.wait();
      const transferFromTx = await mydrcoin.transferFrom(accounts[0], accounts[2], 200);
      await transferFromTx.wait();
      expect(await mydrcoin.balanceOf(accounts[2])).to.equal("200");
      var balance2 = await mydrcoin.balanceOf(accounts[2]);
      console.log("balance2: " + balance2);
  });
});

describe("DrCoin: Test burn", function () {
  it("Should burn 50 token from accounts[0]", async function () {
      let accounts = await web3.eth.getAccounts();
      const DrCoin = await ethers.getContractFactory("DrCoin");
      const mydrcoin = await DrCoin.deploy();
      await mydrcoin.deployed();
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
