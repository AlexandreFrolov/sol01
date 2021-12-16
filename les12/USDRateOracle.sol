// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;
contract USDRateOracle {
  uint public USD_rate;
  string public timestamp;
  uint public unix_timestump;

  event RateUpdate(address sender);
  event UpdatedRate(uint req_rate);

  constructor() {
      USD_rate = 0;
      timestamp = "";
      unix_timestump = 0;
  }
  function requestNewRate() public {
      emit RateUpdate(msg.sender);
  }
  function saveNewRate(uint req_rate, uint uix_timestump, string memory tstamp) public {
      timestamp = tstamp;
      unix_timestump = uix_timestump;
      USD_rate = req_rate;
      emit UpdatedRate(req_rate);
  }
  function getRate() public view returns( uint, uint, string memory) {
      return(USD_rate, unix_timestump, timestamp);
  }
}

