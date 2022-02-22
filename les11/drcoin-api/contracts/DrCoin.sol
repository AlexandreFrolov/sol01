// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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
        unchecked {
          balances[msg.sender] = balances[msg.sender] - tokens;
        }
        balances[recipient] = balances[recipient] + tokens;
        emit Transfer(msg.sender, recipient, tokens);
        return true;
    }

    function transferFrom(address sender, address recipient, uint tokens) public returns (bool success) {
        require(sender != address(0), "Transfer from the zero address");
        require(recipient != address(0), "Transfer to the zero address");
        require(balanceOf(sender) >= tokens, "Not enough tokens");
        require(allowed[sender][msg.sender] >= tokens, "Not enough tokens allowed");
        unchecked {
          balances[sender] = balances[sender] - tokens;
        }
        allowed[sender][msg.sender] = allowed[sender][msg.sender] - tokens;
        balances[recipient] = balances[recipient] + tokens;
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

    function burn(uint256 tokens) public returns (bool success){
        require(balanceOf(msg.sender) >= tokens, "Not enough tokens");
        unchecked {
          balances[msg.sender] -= tokens;
        }
        totalSupply -= tokens;
        emit Burn(msg.sender, tokens);
        emit Transfer(msg.sender, address(0), tokens);
        return true;
    }

    function burnFrom(address from, uint256 tokens) public returns (bool success){
        require(balanceOf(from) >= tokens, "Not enough tokens");
        require(allowed[from][msg.sender] >= tokens, "Not enough tokens allowed");
        unchecked {
          balances[from] -= tokens;
        }
        totalSupply -= tokens;
        emit Burn(from, tokens);
        emit Transfer(from, address(0), tokens);
        return true;
    }

    function mint(address recipient, uint256 tokens) public returns (bool success){
        require(recipient != address(0), "Mint to the zero address");
        totalSupply += tokens;
        balances[recipient] += tokens;
        emit Transfer(address(0), recipient, tokens);
        return true;
    }

    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Burn(address indexed from, uint value);
    // comment
}
//