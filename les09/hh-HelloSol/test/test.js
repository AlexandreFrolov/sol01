const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Тестирование смарт-контракта HelloSol...', function() {

  let HelloSol;
  let myHelloSol;

  beforeEach(async () => {
    HelloSol = await ethers.getContractFactory("HelloSol");
    myHelloSol = await HelloSol.deploy();
    await myHelloSol.deployed();
  });

  it("getValue should return 12345", async function () {
      await myHelloSol.setValue(12345);
      expect(await myHelloSol.getValue()).to.equal(12345);
  });

  it("getString should return 'Тестовая строка 12345'", async function () {
      await myHelloSol.setString('Тестовая строка 12345');
      expect(await myHelloSol.getString()).to.equal('Тестовая строка 12345');
  });
});
