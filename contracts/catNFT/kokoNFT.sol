// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;
import "./ERC721/ERC721.sol";

contract kokoNFT is ERC721 {
    //假设tokenId是按顺序定死的
    uint256 private _nextTokenId = 25446;

    constructor(string memory tokenURI) ERC721("Cat Property", "CatNFT") {
        mint(msg.sender, _nextTokenId + 1, tokenURI);
    }
}
