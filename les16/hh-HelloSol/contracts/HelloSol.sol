// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloSol {
    string savedString;
    int savedValue;

    function setString( string memory newString ) public {
        savedString = newString;
    }

    function setStringCalldata( string calldata newString ) public {
        savedString = newString;
    }

    function getString() public view returns( string memory ) {
        return savedString;
    }

}
