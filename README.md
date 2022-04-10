# Firebase Merkle System

Brief: A system that will calculate if someone is on the allow list for minting or
not.

Developed by: **David Razmadze**

<hr />

## 1. Front-end ReactJS App

- Uses `Moralis` to call Smart Contract

- Uses Firebase Functions to call `firebase-merkle` function

## 2. Firebase Functions

- Uses `merkletreejs` to generate Merkle Tree and `keccak256` for hashing

## 3. Solidity Smart Contract

- Accepts the Merkle Proof and calls a verify function from `MerkleProof.sol`:

  `import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";`
