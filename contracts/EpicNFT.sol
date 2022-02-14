//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";


contract EpicNFT is ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

  // We need to pass the name of our NFTs token and its symbol.
  constructor() ERC721 ("renzoNFT", "SQUARE") {
    console.log("This is my contract running");
  }

  // A function our user will hit to get their NFT.
  function makeNFT() public {
     // Get the current tokenId, this starts at 0.
    uint256 newItemId = _tokenIds.current();

     // Actually mint the NFT to the sender using msg.sender.
    _safeMint(msg.sender, newItemId);

    // Set the NFTs data.
    _setTokenURI(newItemId, "https://jsonkeeper.com/b/P3PU");

    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);


    // Increment the counter for when the next NFT is minted.
    _tokenIds.increment();
  }


}
