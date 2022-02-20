//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";
import 'base64-sol/base64.sol';


contract EpicNFT is ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

      string startSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" ><defs><linearGradient id="a" x1="0%" y1="50%" x2="100%" y2="50%" >';
      string endSvg = '<animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" begin="0s" dur="1.5s" repeatCount="indefinite"/></linearGradient></defs><path style="fill:url(#a)" d="M-100-100h300v300h-300z"/></svg>';


    uint randNonce = 0;

  // We need to pass the name of our NFTs token and its symbol.
  constructor() ERC721 ("renzoNFT", "SQUARE") {
    console.log("This is my contract running");
  }

  function randomRgb() public  returns (uint256) {
    uint random = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % 255;
    randNonce++;
    return random;
  }

  function append(string memory start, string memory color1, string memory
                  color2, string memory color3, string memory end) internal pure returns (string memory) {
    return string(abi.encodePacked(start, color1,",", color2,",", color3, end));

}

function generateRandomLine (string memory percentage) internal  returns (string memory){

    string memory firstColor = Strings.toString(randomRgb());
    string memory secondColor = Strings.toString(randomRgb());
    string memory thirdColor = Strings.toString(randomRgb());

    string memory firstLine = '<stop offset="';
    string memory middleLine = '%" style="stop-color:rgb(';
    string memory endLine = ');stop-opacity:1.00" />';
    
    string memory  withPercentage =
      string(abi.encodePacked(firstLine,percentage,middleLine));

    return append(withPercentage,firstColor,secondColor,thirdColor,endLine);
}

  function makeNFT() public {
    uint256 newItemId = _tokenIds.current();


    string memory line1 = generateRandomLine("0");
    string memory line2 = generateRandomLine("50");
    string memory line3 = generateRandomLine("100");

    string memory  result = string(abi.encodePacked(startSvg,line1,line2,line3,endSvg));


  string memory json = Base64.encode(
        bytes(
            string(
                abi.encodePacked(
                    '{"name": "gradients names", "description": "A highly acclaimed collection of gradients squares .", "image": "data:image/svg+xml;base64,',
                    Base64.encode(bytes(result)),
                    '"}'
                )
            )
        )
    );

    string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------");
    console.log(finalTokenUri);
    console.log("--------------------\n");



    _safeMint(msg.sender, newItemId);

    _setTokenURI(newItemId, finalTokenUri);



    _tokenIds.increment();
    console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
  }


}
