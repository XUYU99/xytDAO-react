// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

// import {Context} from "./Context.sol";
// import "../lib/forge-std/src/console.sol";
import "./ERC721Utils.sol";
import "hardhat/console.sol";

// import "@openzeppelin/contracts/utils/Strings.sol";

// import {Strings} from "../../utils/Strings.sol";

contract ERC721 {
    // 代币名称
    string private _name;
    // 代币符号
    string private _symbol;
    // tokenId 到拥有者地址的映射
    mapping(uint256 => address) private _owners;
    // 拥有者地址到代币数量的映射
    mapping(address => uint256) private _balances;
    //tokenId到代币URL的映射
    mapping(uint256 => string) private _tokenIdtoURI;
    // tokenId 到授权地址的映射
    mapping(uint256 => address) private _tokenApprovals;
    // 拥有者到操作者授权状态的映射
    mapping(address => mapping(address => bool)) private _ApprovalsForAll;

    // uint256 private number = 2333;

    /**
     * @dev 在构造函数中设置 代币名称 {name} 和 代币符号{symbol} 的值。
     */
    constructor(string memory name1, string memory symbol1) {
        // using Strings for uint256
        _name = name1;
        _symbol = symbol1;
        // _balances[msg.sender] = _totalSupply;
        // console.log(_totalSupply);
        console.log("ERC721 contract is called~~");
    }

    // /**
    //  * @dev 查看合约是否支持特定接口。
    //  */
    // function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
    //     return
    //         interfaceId == type(IERC721).interfaceId ||
    //         interfaceId == type(IERC721Metadata).interfaceId ||
    //         super.supportsInterface(interfaceId);
    // }

    /**
     * @dev 返回 `owner` 账户中的代币数量。
     */
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    /**
     * @dev 返回 `tokenId` 代币的拥有者。
     */
    // function ownerOf(uint256 tokenId) external view returns (address) {
    //     return getOwner(tokenId);
    // }

    /**
     * @dev 返回代币的名称。
     */
    function name() public view virtual returns (string memory) {
        return _name;
    }

    /**
     * @dev 返回代币的符号。
     */
    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function mint(
        address account,
        uint256 tokenId,
        string memory tokenURI
    ) internal virtual returns (bool) {
        return _mint(account, tokenId, tokenURI);
    }

    function _mint(
        address account,
        uint256 tokenId,
        string memory tokenURI
    ) internal returns (bool) {
        if (account != address(0)) {
            setTokenURI(tokenId, tokenURI);

            _balances[account] += 1;
            _owners[tokenId] = account;
            console.log("mint completed~~~");
            return true;
        }
        return false;
    }

    /**
     * @dev 返回指定 tokenId 的代币 URI。
     */
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        //_requireOwned函数，判断tokenId是否为空，不为空则返回token的owner
        checkgetOwner(tokenId);
        string memory tokenURI = _tokenIdtoURI[tokenId];
        //如果baseURI的长度大于0，那么将 baseURI 与 tokenId 的字符串拼接起来
        return tokenURI;
    }

    /**
     * @dev
     */
    function setTokenURI(
        uint256 tokenId,
        string memory tokenURI
    ) internal virtual returns (bool) {
        require(
            checkgetOwner(tokenId) == msg.sender,
            "ERROR checkgetOwner: msg.sender is not owner"
        );
        _tokenIdtoURI[tokenId] = tokenURI;
        return true;
    }

    //检查并获取tokenId的拥有者
    function checkgetOwner(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERROR checkgetOwner: owner is null0");

        return owner;
    }

    /**
     * @dev 给to被授权者授权单个代币
     */
    function setApprove(
        address to,
        uint256 tokenId
    ) public virtual returns (bool) {
        //检查调用者是代币的拥有者
        require(
            msg.sender == checkgetOwner(tokenId),
            "ERROR _setApprove:you are not owner"
        );
        if (to == address(0)) {
            console.log("ERROR _setApprove: to address is null0");
            return false;
        } else {
            _tokenApprovals[tokenId] = to;
            console.log("_setApprove completed~~~");
            return true;
        }
    }

    //test如果数组不存在会返回什么值
    /**
     * @dev 通过tokenId获取代币的操作者（也就是被授权者）
     */
    function checkgetApproved(uint256 tokenId) public view returns (address) {
        address owner = checkgetOwner(tokenId);
        address operator = _tokenApprovals[tokenId];
        if (operator == address(0)) {
            console.log("ERROR checkgetApproved: operator is null");
            return address(0);
        }
        return operator;
    }

    /**
     * @dev 授权 `operator` 操作 `owner` 的所有代币
     */
    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) public virtual returns (bool) {
        if (operator == address(0)) {
            console.log("ERROR _setApprovalForAll:operator is null0");
            return false;
        }
        _ApprovalsForAll[owner][operator] = true;
        console.log("_setApprovalForAll completed~~~");

        return true;
    }

    /**
     * @dev 判断操作者是否被授权操作拥有者的所有代币
     */
    function isApprovalForAll(
        address owner,
        address operator
    ) public view returns (bool) {
        return _ApprovalsForAll[owner][operator];
    }

    /**
     * @dev 转移特定的tokenId
     */
    function transfer(
        address to,
        uint256 tokenId
    ) public virtual returns (bool) {
        bool isComplete;
        require(to != address(0), "ERROR transfer: to address is null");
        if (msg.sender == _owners[tokenId]) {
            isComplete = update(msg.sender, to, tokenId);
            console.log("transfer completed~~~");
            return isComplete;
        }
        console.log("ERROR transfer: You are not owner");
        return isComplete;
    }

    function update(
        address from,
        address to,
        uint256 tokenId
    ) internal returns (bool) {
        if (from != address(0) && to != address(0)) {
            if ((from == _owners[tokenId]) && (_balances[from] > 0)) {
                _balances[from] -= 1;
                _balances[to] += 1;
                _owners[tokenId] = to;
                console.log("update completed~~~");
                return true;
            }
        }
        return false;
    }

    // function safeTransfer(
    //     address from,
    //     address to,
    //     uint256 tokenId,
    //     bool isOperator, bytes memory data
    // ) public virtual {
    // }

    /**
     * @dev 被授权者转移 特定的tokenId
     */
    function transferFrom(
        address to,
        uint256 tokenId
    ) public virtual returns (bool) {
        bool isComplete;
        address operator = msg.sender;
        address owner = checkgetOwner(tokenId);
        //判断msg.sender是否有权限
        if (
            (checkgetApproved(tokenId) != address(0)) ||
            isApprovalForAll(owner, operator)
        ) {
            isComplete = update(owner, to, tokenId);
            console.log("transferForm completed ~~");
        } else {
            console.log("ERROR transferFrom: no approve");
        }
        return isComplete;
    }

    function _increaseBalance(address account, uint128 value) internal virtual {
        unchecked {
            _balances[account] += value;
        }
    }

    function burn(uint256 tokenId) internal {
        //判断代币是否存在
        require(
            _owners[tokenId] != address(0),
            "ERROR burn: token is not exist"
        );
        //判断msg.sender是owner
        require(
            msg.sender == checkgetOwner(tokenId),
            "ERROR burn:you are not owner"
        );

        _burn(tokenId);
    }

    function _burn(uint256 tokenId) internal returns (bool) {
        address owner = checkgetOwner(tokenId);
        //清除单币授权
        _tokenApprovals[tokenId] = address(0);
        //销毁代币
        _balances[owner] -= 1;
        return true;
    }
}
