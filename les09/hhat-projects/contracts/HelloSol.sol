// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract HelloSol {
    string savedString;
    uint savedValue;

    string private greeting;

    constructor(string memory _greeting) {
        console.log("Deploying a HelloSol with greeting:", _greeting);
        greeting = _greeting;
    }


    function setString( string memory newString ) public {
        savedString = newString;
    }
    function getString() public view returns( string memory ) {
        return savedString;
    }
    function setValue( uint newValue ) public {
        savedValue = newValue;
    }
    function getValue() public view returns( uint ) {
        return savedValue;
    }
}

