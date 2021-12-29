// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract DrCoin {
    string public name = "Doctor Coin";
    string public symbol = "DRCOIN";
    uint8 public decimals = 18;
    uint public totalSupply = 1000000 * (uint256(10) ** decimals);

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    constructor() {
        balances[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }

    function transfer(address recipient, uint tokens) public returns (bool success) {
        require(recipient != address(0), "Transfer to the zero address");
        require(balances[msg.sender] >= tokens, "Not enough tokens");

        balances[msg.sender] = safeSub(balances[msg.sender], tokens);
        balances[recipient] = safeAdd(balances[recipient], tokens);
        emit Transfer(msg.sender, recipient, tokens);
        return true;
    }

    function transferFrom(address sender, address recipient, uint tokens) public returns (bool success) {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(balanceOf(sender) >= tokens, "Not enough tokens");
        require(allowed[sender][msg.sender] >= tokens, "Not enough tokens allowed");

        balances[sender] = safeSub(balances[sender], tokens);
        allowed[sender][msg.sender] = safeSub(allowed[sender][msg.sender], tokens);
        balances[recipient] = safeAdd(balances[recipient], tokens);
        emit Transfer(sender, recipient, tokens);
        return true;
    }

    function approve(address spender, uint tokens) public returns (bool success) {
        require(address(spender) != address(0), "Transfer to the zero address");
        allowed[msg.sender][spender] = tokens;
        emit Approval(msg.sender, spender, tokens);
        return true;
    }

    function allowance(address tokenOwner, address spender) public view returns (uint remaining) {
        return allowed[tokenOwner][spender];
    }

    function burn (uint256 _value) public {
        require(balanceOf(msg.sender) >= _value, "Not enough tokens");
        balances[msg.sender] -= _value;
        totalSupply -= _value;
        emit Burn(msg.sender, _value);
    }

    function burnFrom(address _from, uint256 _value) public {
        require(balanceOf(_from) >= _value, "Not enough tokens");
        require(allowed[_from][msg.sender] >= _value, "Not enough tokens allowed");
        balances[_from] -= _value;
        totalSupply -= _value;
        emit Burn(_from, _value);
    }

    function safeAdd(uint a, uint b) internal pure returns (uint c) {
        c = a + b;
        require(c >= a, "Addition overflow");
    }
    function safeSub(uint a, uint b) internal pure returns (uint c) {
        require(b <= a, "Subtraction overflow");
        c = a - b;
    }

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Burn(address indexed from, uint value);
}

