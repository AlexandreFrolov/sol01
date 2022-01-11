const DrCoin = artifacts.require("DrCoin");

contract("name test", async accounts => {

  console.log('Account 0: ' + accounts[0]);
  console.log('Account 1: ' + accounts[1]);
  console.log('Account 2: ' + accounts[2]);


  it("name should return Doctor Coin", async () => {
    let instance = await DrCoin.deployed();
    let str = await instance.name.call();
    assert.equal(str, "Doctor Coin");
  });
  it("symbol should return 'DRCOIN'", async () => {
    let instance = await DrCoin.deployed();
    let str = await instance.symbol.call();
    assert.equal(str, "DRCOIN");
  });
  it("totalSupply should return '1000000000000000000000000'", async () => {
    let instance = await DrCoin.deployed();
    let str = await instance.totalSupply.call();
    assert.equal(str, "1000000000000000000000000");
  });
  it("balanceOf[0] should return '1000000000000000000000000'", async () => {
    let instance = await DrCoin.deployed();
    let balance = await instance.balanceOf.call(accounts[0]);
    assert.equal(balance.valueOf(), 1000000000000000000000000);
  });

  it("balanceOf[1] should return '1000'", async () => {
    let instance = await DrCoin.deployed();
    let rc = await instance.transfer.call(accounts[2], 1000);
    console.log('transfer rc: ' + rc);

    let balance1 = await instance.balanceOf.call(accounts[2]);
    assert.equal(balance1.toString(), 1000);
  });


});
