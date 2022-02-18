// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
    1.nft point to an address
    2.keep track of token ids 
    3.track of owner add to token ids
    4. track of how many token owner has
*/
import './ERC165.sol';
import './interfaces/IERC721.sol';

contract ERC721 is ERC165,IERC721{
    // logging info
    //only 3 indexed allowed to save gas
    // event Transfer(
    //     address indexed from, 
    //     address indexed to, 
    //     uint256 indexed tokenId);


    //mappping creates an hash table key pair value
    mapping(uint256 => address) private _tokenOwner;

    mapping(address => uint256) private _ownedTokens; 

    constructor() {
        _registerInterface(bytes4(keccak256('balanceOf(bytes4)')^keccak256('ownerOf(bytes4)')^keccak256('transferFrom(bytes4)')));
    }

    function balanceOf(address _owner) public override view returns(uint256){
        
        require(_owner != address(0),'owner is zero');
        return _ownedTokens[_owner];
    }

    function ownerOf(uint _tokenId) public override view returns(address) {
        address owner = _tokenOwner[_tokenId];
        require(owner != address(0), 'owner not found');
        return owner;
    }
    function _exists(uint256 tokenId) internal  view returns(bool){
        address owner = _tokenOwner[tokenId];
        return owner != address(0);
    }

    function _mint (address to, uint256 tokenId)  internal virtual {
        
        require(to != address(0), 'ERC721: minting to zero address');
        require(!_exists(tokenId),'ERC721: token already minted');


        _tokenOwner[tokenId] = to;
        _ownedTokens[to] += 1;

        //just logging info
        emit Transfer(address(0), to, tokenId);
    }

    function _transferFrom(address _from, address _to, uint _tokenId) internal{
        require(_to != address(0),'Transfering to zer address');
        require(ownerOf(_tokenId) == _from, 'you dont own the nft dipshit');

        _ownedTokens[_from] -= 1;
        _ownedTokens[_to] +=1;

        _tokenOwner[_tokenId] = _to;

        emit Transfer(_from, _to, _tokenId);
    } 

    function transferFrom(address _from, address _to, uint _tokenId) override public{
        _transferFrom(_from,_to,_tokenId);
    }
}