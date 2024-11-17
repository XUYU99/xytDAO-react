// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC20} from "../contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "../contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Votes} from "../contracts/token/ERC20/extensions/ERC20Votes.sol";
import {Nonces} from "../contracts/utils/Nonces.sol";
import "hardhat/console.sol";

contract kokoToken is ERC20, ERC20Permit, ERC20Votes {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) ERC20Permit(_name) {
        _mint(msg.sender, 100 * (10 ** uint256(decimals())));
    }

    function mint(uint256 value) public {
        console.log("kokoToken-mint()-msg.sender:", msg.sender);
        address account = msg.sender;
        super._mint(account, value);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, amount);
    }

    function nonces(
        address owner
    ) public view virtual override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
