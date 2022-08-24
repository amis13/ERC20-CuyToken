// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CuyToken is ERC20 {

    /**
     * Contract initialization.
     */
    constructor(string memory name, string memory symbol, uint256 supply) ERC20(name, symbol) {
        _mint(msg.sender, supply * (10**decimals()));
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}