// contracts/DrNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract DrNFT is ERC721, Ownable, ERC721URIStorage, ERC721Burnable, IERC721Receiver , ERC721Enumerable {

  // Optional mapping for token URIs
  mapping (uint256 => string) private _tokenURIs;

  // Base URI
  string private _baseURIextended;

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("Doctor NFT", "DRNFT") {
  }

  function mint(address _to, string memory tokenURI_ ) external onlyOwner() {
//     require(_tokenIds.current() < 3);
    _tokenIds.increment();
    uint256 newNftTokenId = _tokenIds.current();
    _safeMint(_to, newNftTokenId);
    _setTokenURI(newNftTokenId, tokenURI_);
  }

  function setBaseURI(string memory baseURI_) external onlyOwner() {
    _baseURIextended = baseURI_;
  }

  function _baseURI() internal view override returns (string memory) {
     return _baseURIextended;
  }

  function tokenURI(uint256 tokenId) public view override (ERC721, ERC721URIStorage) returns (string memory) {
    return super.tokenURI(tokenId);
  }

  function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override {
    require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
    _safeTransfer(from, to, tokenId, _data);
  }

  function _burn(uint256 tokenId) internal override (ERC721, ERC721URIStorage) {
    super._burn(tokenId);
    if (bytes(_tokenURIs[tokenId]).length != 0) {
      delete _tokenURIs[tokenId];
    }
  }

  function onERC721Received(address,address,uint256, bytes calldata) public virtual override returns (bytes4) {
    return this.onERC721Received.selector;
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override (ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return interfaceId == type(IERC721Enumerable).interfaceId || super.supportsInterface(interfaceId);
  }

  function tokenByIndex(uint256 index) public view override(ERC721Enumerable) returns (uint256) {
    return super.tokenByIndex(index);
  }
}
