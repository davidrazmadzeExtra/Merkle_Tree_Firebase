//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.9 <0.9.0;

contract NFTToken {
    // ...
    // Standard NFT Functions and Properties
    // ...

    /*
        Params: Mint Amount and Merkle Proof (Generated from Firebase)
        Mints if Merkle Proof is verfied for the Merkle Tree
    */
    function whitelistMint(uint256 _mintAmount, bytes32[] calldata _merkleProof)
        public
        payable
        mintCompliance(_mintAmount)
        mintPriceCompliance(_mintAmount)
    {
        // Verify whitelist requirements
        require(whitelistMintEnabled, "The whitelist sale is not enabled!");
        require(!whitelistClaimed[_msgSender()], "Address already claimed!");
        bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
        require(
            MerkleProof.verify(_merkleProof, merkleRoot, leaf),
            "Invalid proof!"
        );

        whitelistClaimed[_msgSender()] = true;
        _safeMint(_msgSender(), _mintAmount);
    }

    // ...
    // Standard NFT Functions and Properties
    // ...
}
