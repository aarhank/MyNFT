// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract Juit is ERC721Connector{
    //to store nft
    string[] public juit;

    mapping(string => bool) _nftExists;

    function mint(string memory _juit) public{
        require(!_nftExists[_juit], 'Error- nft already exists');

        juit.push(_juit);
        uint _id = juit.length - 1;
        _mint(msg.sender, _id);

        _nftExists[_juit] = true;
    }


    constructor() ERC721Connector('Juit','Heaven'){
        
    }
}