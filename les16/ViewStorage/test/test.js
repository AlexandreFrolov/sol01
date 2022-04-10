const { expect } = require("chai");
require("@nomiclabs/hardhat-web3");
const { ethers } = require("hardhat");

describe('Тестирование смарт-контракта HelloSol...', function() {

  let HelloSol;
  let myHelloSol;

  beforeEach(async () => {
    HelloSol = await ethers.getContractFactory("HelloSol");
    myHelloSol = await HelloSol.deploy();
    await myHelloSol.deployed();
  });


  it("setDiv should store 2", async function () {
      await myHelloSol.setDiv(8,4);
      expect(await myHelloSol.getStorageValue()).to.equal(2);
  });

  it("setDivAsm should store 2", async function () {
      await myHelloSol.setDivAsm(14,7);
      expect(await myHelloSol.getStorageValue()).to.equal(2);
  });


  it("setMemoryValue should return 123", async function () {
      await myHelloSol.setMemoryValue(123);
      expect(await myHelloSol.setMemoryValue(123)).to.equal(123);
  });

  it("setStorageValue should return 123", async function () {
      await myHelloSol.setStorageValue(123);
      expect(await myHelloSol.getStorageValue()).to.equal(123);
  });

  it("setStorageValueExt should return 123", async function () {
      await myHelloSol.setStorageValueExt(123);
      expect(await myHelloSol.getStorageValue()).to.equal(123);
  });

  it("setStorageValueNegative should return -1", async function () {
      await myHelloSol.setStorageValueNegative(-1);
      expect(await myHelloSol.getStorageValueNegative()).to.equal(-1);
  });

  it("getString should return 'Test string 2022-03-30'", async function () {
      await myHelloSol.setString('Test string 2022-03-30');
      expect(await myHelloSol.getString()).to.equal('Test string 2022-03-30');
  });

  it("getString should return 'Test string 2022-03-30' (use calldata)", async function () {
      await myHelloSol.setStringCalldata('Test string 2022-03-30');
      expect(await myHelloSol.getString()).to.equal('Test string 2022-03-30');
  });

  it("getBytes should return '0x5465737420737472696e6720323032322d30332d333000000000000000000000'", async function () {
      const ascii = 'Test string 2022-03-30\0\0\0\0\0\0\0\0\0\0';
      const hex = web3.utils.asciiToHex(ascii);
      console.log(hex);
      await myHelloSol.setBytes(hex);
      expect(await myHelloSol.getBytes()).to.equal(hex);
  });

  it("expLoop getStorageValue hould return 5", async function () {
      await myHelloSol.expLoop(5);
      expect(await myHelloSol.getStorageValue()).to.equal(5);
  });

  it("optLoop getStorageValue should return 5", async function () {
      await myHelloSol.optLoop(5);
      expect(await myHelloSol.getStorageValue()).to.equal(5);
  });

  it("doNotUseKeccak256", async function () {
      await myHelloSol.doNotUseKeccak256();
      const raw = await myHelloSol.getKeccak256();
      expect(raw).to.equal("0x9aa569ae2e35d886c7a456cc32b7dd7cd61ecbb0f489b03214cbb5255a6e3aa9");
      //                    0x5465737420737472696e6720323032322d30332d333000000000000000000000000000
  });

  it("expUseKeccak256", async function () {
      await myHelloSol.expUseKeccak256("Test string just for sample. Test string just for sample.", 777, "0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512");
      const raw = await myHelloSol.getKeccak256();
      expect(raw).to.equal("0x9aa569ae2e35d886c7a456cc32b7dd7cd61ecbb0f489b03214cbb5255a6e3aa9");
  });

  it("getBool should return true", async function () {
      await myHelloSol.setBool(7, true);
      expect(await myHelloSol.getBool(7)).to.equal(true);
  });

  it("getBoolB should return true", async function () {
      await myHelloSol.setBoolB(true);
      expect(await myHelloSol.getBoolB()).to.equal(true);
  });

  it("getBoolean should return true", async function () {
      await myHelloSol.setBool(7, true);
      expect(await myHelloSol.getBool(7)).to.equal(true);
  });

  it("getBoolStruct should return true", async function () {
      await myHelloSol.setBoolStruct(true);
      expect(await myHelloSol.getBoolStruct()).to.equal(true);
  });


  it("getMapValue should return 1", async function () {
      await myHelloSol.setUintMap(1,1);
      expect(await myHelloSol.getMapValue(1)).to.equal(1);
  });

  it("getArrayValue should return 1", async function () {
      await myHelloSol.setUintArray(1);
      expect(await myHelloSol.getArrayValue(0)).to.equal(1);
  });

});
