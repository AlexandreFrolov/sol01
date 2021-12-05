// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/HelloSol.sol";

contract TestHelloSol {
  function testSetValue() public {
    HelloSol helloSol = HelloSol(DeployedAddresses.HelloSol());
    helloSol.setValue(77);
    uint expectedValue = 77;
    uint actualValue = helloSol.getValue();
    Assert.equal(actualValue, expectedValue, "Value should be equal 77");
  }

  function testSetString() public {
    HelloSol helloSol = HelloSol(DeployedAddresses.HelloSol());
    helloSol.setString("My test string");
    string memory expectedString = "My test string";
    string memory actualString = helloSol.getString();
    Assert.equal(actualString, expectedString, "String should be equal 'My test string'");
  }
}
