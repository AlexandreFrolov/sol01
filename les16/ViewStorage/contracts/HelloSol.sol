// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloSol {
    
    uint128 storage_value_1;
    uint128 storage_value_2;
    uint storage_value;
    int storage_value_negative;


    string savedString;
    bytes32 savedBytes;

    int savedValue;

    uint itValue;
    bytes32 keccak256Result;

    uint booleanValue;
    bool b1;
    bool b2;
    bool b3;
    bool b4;

    struct BoolStruct {
      bool b1;
      bool b2;
      bool b3;
      bool b4;
    }

    BoolStruct bs;

	mapping(uint => uint) public uintMap;
	uint[] public uintArray;


    constructor() {
          booleanValue = 0;
//        booleanValue = 0xfffffff;
    }


    function setUintMap(uint idx, uint value) public {
	  uintMap[idx] = value;
    }

    function setUintArray(uint value) public {
	  uintArray.push(value);
    }

    function getMapValue(uint idx) public view returns(uint) {
    	return uintMap[idx];
    }

    function getArrayValue(uint idx) public view returns(uint) {
    	return uintArray[idx];
    }

    function setStorageValue(uint newValue) public {
        storage_value = newValue;
    }

    function setStorageValueExt(uint newValue) external {
        storage_value = newValue;
    }

    function getStorageValue() public view returns(uint) {
        return storage_value;
    }

    function setStorageValueNegative(int newValue) public {
        storage_value_negative = newValue;
    }

    function getStorageValueNegative() public view returns(int) {
        return storage_value_negative;
    }

    function setMemoryValue(uint newValue) public pure returns(uint) {
        uint memory_value;
        memory_value = newValue;
        return memory_value;
    }

    function setString(string memory newString) public {
        savedString = newString;
    }

    function setStringCalldata(string calldata newString) public {
        savedString = newString;
    }

    function getString() public view returns(string memory) {
        return savedString;
    }

    function setBytes(bytes32 newBytes) public {
        savedBytes = newBytes;
    }

    function getBytes() public view returns (bytes32) {
        return savedBytes;
    }

    function setDiv(uint x, uint y) public {
        storage_value = x/y;
    }

    function setDivAsm(uint x, uint y) public {
        uint result;
        assembly {
          result := div(x, y)
        }
        storage_value = result;
    }

    function expLoop(uint iterations) public {
        for(uint i = 0; i < iterations; i++) {
            itValue += 1;
        }
        storage_value = itValue;
    }

    function optLoop(uint iterations) public {
        uint itValueLoc;
        for(uint iLoc = 0; iLoc < iterations; iLoc++) {
            itValueLoc += 1;
        }
        storage_value = itValueLoc;
    }

    function getKeccak256() public view returns(bytes32) {
        return keccak256Result;
    }

    function expUseKeccak256(string memory _text, uint _num, address _addr) public {
        keccak256Result = keccak256(abi.encode(_text, _num, _addr));
    }

    function doNotUseKeccak256() public {
        keccak256Result = 0x9aa569ae2e35d886c7a456cc32b7dd7cd61ecbb0f489b03214cbb5255a6e3aa9;
    }

    function setBool(uint256 boolNumber, bool value) public {
        if (value)
            booleanValue = booleanValue | uint256(1) << boolNumber;
        else
            booleanValue = booleanValue & ~(uint256(1) << boolNumber);
    }

    function getBool(uint256 boolNumber) public view returns(bool)
    {
        uint256 flag = (booleanValue >> boolNumber) & uint256(1);
        return (flag == 1 ? true : false);
    }

    function setBoolB( bool value) public {
        b1 = value;
    }

    function getBoolB() public view returns(bool)
    {
        return (b1);
    }

    function setBoolStruct(bool value) public {
        bs.b1 = value;
    }

    function getBoolStruct() public view returns(bool)
    {
        return (bs.b1);
    }

}
