const HelloSol = artifacts.require("HelloSol");

contract("getValue test", async accounts => {
  it("getValue should return 777", async () => {
    let instance = await HelloSol.deployed();
    await instance.setValue(777);
    let val = await instance.getValue.call();
    assert.equal(val.valueOf(), 777);
  });
  it("getString should return 'My test string'", async () => {
    let instance = await HelloSol.deployed();
    await instance.setString("My test string");
    let str = await instance.getString.call();
    assert.equal(str, "My test string");
  });
});
