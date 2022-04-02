const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Тестирование смарт-контракта HelloSol...', function() {

  let HelloSol;
  let myHelloSol;

  beforeEach(async () => {
    HelloSol = await ethers.getContractFactory("HelloSol");
    myHelloSol = await HelloSol.deploy();
    await myHelloSol.deployed();

    IntOptimization = await ethers.getContractFactory("IntOptimization");
    myIntOptimization = await IntOptimization.deploy();
    await myIntOptimization.deployed();

  });


  it("getString should return 'Тестовая строка 12345'", async function () {
      await myHelloSol.setString('Тестовая строка 12345');
      expect(await myHelloSol.getString()).to.equal('Тестовая строка 12345');
  });

  it("getString should return 'Тестовая строка 12345' (use calldata)", async function () {
      await myHelloSol.setStringCalldata('Тестовая строка 12345');
      expect(await myHelloSol.getString()).to.equal('Тестовая строка 12345');
  });


  it("myIntOptimization getValue should return 1", async function () {
      await myIntOptimization.setValue(1);
      expect(await myIntOptimization.getValue()).to.equal(1);
  });

  it("myIntOptimization getValue should return -1", async function () {
      await myIntOptimization.setValueNegative(-1);
      expect(await myIntOptimization.getValue()).to.equal(-1);
  });


  it("myIntOptimization doCountState", async function () {
      await myIntOptimization.doCountState();
  });

  it("myIntOptimization doCountLocal", async function () {
    await myIntOptimization.doCountLocal();
  });

});
