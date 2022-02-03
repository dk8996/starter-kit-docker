// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 <= 0.8.11;

import "./Token.sol";

contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint rate = 100;

    constructor(Token _token) {
        token = _token;
    }

    function buyTokens() public payable {
        uint256 tokenAmount = msg.value * rate;
        token.transfer(msg.sender, tokenAmount);
    }
}