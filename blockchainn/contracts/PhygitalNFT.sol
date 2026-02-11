// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PhygitalNFT is ERC721, Ownable {

    // Auto-incrementing token ID counter
    uint256 private _tokenIdCounter;

    // tokenId → product hash (stored on-chain permanently)
    mapping(uint256 => bytes32) public productHashes;

    // product hash → tokenId (for lookup during verification)
    mapping(bytes32 => uint256) public hashToToken;

    // Fired when a new NFT certificate is minted
    event CertificateMinted(
        uint256 indexed tokenId,
        bytes32 productHash,
        address indexed brand
    );

    constructor() ERC721("PhygitalCert", "PHYG") Ownable(msg.sender) {}

    /**
     * @dev Mint a certificate NFT for a physical product
     * @param brandWallet  The brand's wallet address — they receive the NFT
     * @param productHash  keccak256 hash of the productId from your DB
     */
    function mintCertificate(
        address brandWallet,
        bytes32 productHash
    ) external onlyOwner returns (uint256) {
        // Prevent the same product being minted twice
        require(hashToToken[productHash] == 0, "Certificate already exists");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _mint(brandWallet, tokenId);

        productHashes[tokenId] = productHash;
        hashToToken[productHash] = tokenId;

        emit CertificateMinted(tokenId, productHash, brandWallet);

        return tokenId;
    }

    /**
     * @dev Verify a product — called during QR scan
     * @param productHash  keccak256 hash of the productId
     * @return isValid      true if certificate exists
     * @return tokenId      the NFT token ID
     * @return currentOwner wallet address of current owner
     */
    function verifyCertificate(
        bytes32 productHash
    ) external view returns (bool isValid, uint256 tokenId, address currentOwner) {
        tokenId = hashToToken[productHash];
        if (tokenId == 0) {
            return (false, 0, address(0));
        }
        return (true, tokenId, ownerOf(tokenId));
    }
}