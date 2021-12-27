// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract StructSample {

    address public owner;

    struct parkingMember {
        uint id;
        string name;
        uint balance;
        bool isActive;
    }

    parkingMember parkingStruct;
    parkingMember[] public parkingMembersList;

    mapping(uint => parkingMember) public parkingMemberMap;

    constructor() payable {
        owner = msg.sender;

        parkingStruct = parkingMember({id:1, name:"Alexandre", balance:200, isActive:true});
        parkingMembersList.push(parkingStruct);

        parkingMemberMap[1] = parkingStruct;
    }

    function getMapMemberName(uint id) view public returns ( string memory) {
        string memory memberName = parkingMemberMap[id].name;
        return memberName;
    }

    function getMemberName(uint id) view public returns ( string memory) {
        string memory memberName = parkingMembersList[id].name;
        return memberName;
    }

    function listMembers() view public returns ( parkingMember[] memory) {
        return parkingMembersList;
    }

    function addMember(uint id, string memory name, uint balance) payable public returns ( bool) {
        parkingStruct = parkingMember({id:id, name:name, balance:balance, isActive:true});

        parkingMembersList.push(parkingStruct);
        parkingMemberMap[id] = parkingStruct;

        return(true);
    }
}
