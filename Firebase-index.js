const functions = require("firebase-functions");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

/*
    Params: wallet address
    Returns: Status, data, & Merkle Proof
*/
exports.firebaseMerkle = functions.https.onCall((data, context) => {
  functions.logger.info("Starting firebaseMerkle calculation", {
    structuredData: true,
  });

  // 1. Get parameters from the function called from client side

  const walletAddress = data.walletAddress;

  let whitelistAddresses = [
    "0X5B38DA6A701C568545DCFCB03FCB875F56BEDDC4",
    "0X5A641E5FB72A2FD9137312E7694D42996D689D99",
    "0XDCAB482177A592E424D1C8318A464FC922E8DE40",
    "0X6E21D37E07A6F7E53C7ACE372CEC63D4AE4B6BD0",
    "0X09BAAB19FC77C19898140DADD30C4685C597620B",
    "0XCC4C29997177253376528C05D3DF91CF2D69061A",
    "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    "0x943926A8fF0000350d0B879A658fA52BCd4FCA18",
  ];

  // 2. Create a new array of `leafNodes` by hashing all indexes of the `whitelistAddresses`
  // using `keccak256`. Then creates a Merkle Tree object using keccak256 as the algorithm.
  const leafNodes = whitelistAddresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });

  // 3. Get root hash of the `merkleeTree` in hexadecimal format (0x)
  const rootHash = merkleTree.getRoot();

  // ***** ***** ***** CLIENT-SIDE ***** ***** ***** //

  const claimingAddress = keccak256(walletAddress);
  const hexProof = merkleTree.getHexProof(claimingAddress);

  const verifyProof = merkleTree.verify(hexProof, claimingAddress, rootHash);

  // Log the merkle root hash
  functions.logger.log("rootHash: ");
  functions.logger.log(rootHash);

  // Send back the response data to the client (ReactJS App)
  return {
    status: "success",
    data: hexProof,
    verified: verifyProof,
  };
});
