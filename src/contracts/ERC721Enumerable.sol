// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721.sol';
import './interfaces/IERC721Enumerable.sol';

contract ERC721Enumerable is ERC721,IERC721Enumerable {
    
    uint256[] private _allTokens;

    //mapping tokenid in _alltokens
    mapping(uint256 => uint256) private _allTokenIndex;
    
    //mapping owner to all owner token ids
    mapping(address => uint256[]) private _ownedTokens;

    //mapping token Id index to owner token list 
    mapping(uint256 => uint256) private _ownedTokensIndex; 

    constructor() {
        _registerInterface(bytes4(keccak256('totalSupply(bytes4)')^keccak256('tokenByIndex(bytes4)')^keccak256('tokenOfOwnerByIndex(bytes4)')));
    }

    function tokenByIndex(uint256 _index) external override view returns(uint256){
        require(_index < totalSupply(), 'global index out of bounce');
        return _allTokens[_index];

    }

    function tokenOfOwnerByIndex(address _owner, uint256 _index) external override view returns(uint256){
        
        require(_index < balanceOf(_owner));
        return _ownedTokens[_owner][_index];

    }

    function _mint(address to, uint256 tokenId) override(ERC721) internal {
        super._mint(to, tokenId);
        _addTokensToAllTokenEnumeration(tokenId);
        _addTokensToOwnerEnumeration(to, tokenId);
    }

    function _addTokensToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    } 

    function _addTokensToAllTokenEnumeration(uint256 tokenId) private {
        _allTokenIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    function totalSupply() public override view returns(uint256){
        return _allTokens.length;
    }
}