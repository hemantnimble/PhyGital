// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhygitalNFT is ERC721, Ownable {

    uint256 private _tokenIdCounter;
    mapping(uint256 => bytes32) public productHashes;
    mapping(bytes32 => uint256) public hashToToken;

    event CertificateMinted(
        uint256 indexed tokenId,
        bytes32 productHash,
        address indexed brand
    );

    // ← NEW EVENT for transfers
    event OwnershipTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    constructor() ERC721("PhygitalCert", "PHYG") Ownable(msg.sender) {}

    function mintCertificate(
        address brandWallet,
        bytes32 productHash
    ) external onlyOwner returns (uint256) {
        require(hashToToken[productHash] == 0, "Already minted");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _mint(brandWallet, tokenId);

        productHashes[tokenId] = productHash;
        hashToToken[productHash] = tokenId;

        emit CertificateMinted(tokenId, productHash, brandWallet);

        return tokenId;
    }

    function verifyCertificate(
        bytes32 productHash
    ) external view returns (bool, uint256, address) {
        uint256 tokenId = hashToToken[productHash];
        if (tokenId == 0) return (false, 0, address(0));
        return (true, tokenId, ownerOf(tokenId));
    }

    // ← NEW FUNCTION: Platform-controlled transfer
    function transferOwnership(
        uint256 tokenId,
        address from,
        address to
    ) external onlyOwner {
        require(ownerOf(tokenId) == from, "From address is not the owner");
        require(to != address(0), "Cannot transfer to zero address");

        _transfer(from, to, tokenId);

        emit OwnershipTransferred(tokenId, from, to);
    }
}