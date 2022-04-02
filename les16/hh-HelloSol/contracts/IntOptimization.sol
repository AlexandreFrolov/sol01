// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IntOptimization {
    int savedValue;
    int[] public arrState;
    uint arrCounter;

    function setValue( int newValue ) public {
        savedValue = newValue;
    }

    function setValueNegative( int newValue ) public {
        savedValue = newValue;
    }

    function getValue() public view returns( int ) {
        return savedValue;
    }

    function doCountState() external {                
      for(uint256 i; i < arrState.length; i++) { 
        arrCounter++; 
      }        
    }

    function doCountLocal() view external {                //
      uint256 length = arrState.length;
      uint256 local_mycounter = arrCounter;
      for(uint256 i; i < length; i++) { 
        local_mycounter++; 
      }        
    }

}
