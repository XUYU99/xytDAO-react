// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControl} from "../openzeppelin/access/AccessControl.sol";
import {ERC721} from "../openzeppelin/token/ERC721/ERC721.sol";
import {ERC721Burnable} from "../openzeppelin/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721URIStorage} from "../openzeppelin/token/ERC721/extensions/ERC721URIStorage.sol";

contract kokoCatNFT is ERC721, ERC721URIStorage, ERC721Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;
    uint256 public totalMintSupply;
    // 猫猫的综合信息结构体
    struct Property {
        string name; // 猫猫名字
        uint256 chipId; // 芯片ID
        uint256 birthDate; // 出生年月日（UNIX时间戳）
        uint256 age;
        bool sex;
        string breed;
    }

    // 存储猫猫信息
    mapping(uint256 => Property) public cats;

    constructor(
        address defaultAdmin,
        address minter
    ) ERC721("Cat Property", "kokoCAT") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, minter);
        totalMintSupply = 0;
    }

    uint256 public newtokenId;

    function getTokenId() public view returns (uint256) {
        return newtokenId;
    }

    function getTotalMintSupply() public view returns (uint256) {
        return totalMintSupply;
    }

    function safeMint(
        address to,
        string memory uri
    ) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        newtokenId = tokenId;
        totalMintSupply = totalMintSupply + 1;
    }

    // 通过 tokenId 获取 tokenURI
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function burn(uint256 tokenId) public virtual override {
        super.burn(tokenId);
        require(totalMintSupply > 0, "burn error: totalMintSupply is 0");
        totalMintSupply = totalMintSupply - 1;
    }

    //  检查合约是否支持某个特定的接口
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // 添加猫猫信息
    function addCat(
        uint256 tokenId,
        string memory _name,
        uint256 _chipId,
        uint256 _birthDate,
        uint256 _age,
        bool _sex,
        string memory _breed
    ) public {
        cats[tokenId] = Property({
            name: _name,
            chipId: _chipId,
            birthDate: _birthDate,
            age: _age,
            sex: _sex,
            breed: _breed
        });
    }

    // 获取猫猫信息
    function getCat(uint256 tokenId) public view returns (Property memory) {
        Property memory cat = cats[tokenId];
        return cat;
    }
}
