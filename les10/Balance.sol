// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Balance {

    address owner;
    function getWeiBalance() public view returns ( uint ) {
        address myAddress = msg.sender;
        uint balance = myAddress.balance;
        return balance;
    }

    function getEtherBalance() public view returns ( uint ) {
        address myAddress = msg.sender;
        uint balance = myAddress.balance;
        return balance/(1 ether);
    }
}

