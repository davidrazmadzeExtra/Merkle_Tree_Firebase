/*
    Calls Firebase Merkle Function when user presses mint button
    If user is on the whitelist, then call mint(), else alert error.
*/
const mintPressed = async () => {
  // Make sure user is authenticated
  if (!isAuthenticated) {
    return;
  }

  // Get user's Ethereum Address
  // const ethAddress = user.get("ethAddress");
  // Hardcoded - you would get address from MetaMask wallet!
  const ethAddress = "0X5B38DA6A701C568545DCFCB03FCB875F56BEDDC5";

  // Firebase Functions
  // https://firebase.google.com/docs/functions
  const functions = getFunctions();

  // Calling a Firebase Function called 'firebaseMerkle' and passing in wallet address
  const firebaseMerkle = httpsCallable(functions, "firebaseMerkle");
  firebaseMerkle({
    walletAddress: ethAddress,
  }).then((result) => {
    // Get back the return values from Firebase Merkle Function
    const data = result.data;

    console.log(data.data);
    console.log("isVerified: " + data.verified);
    const proof = data.data;
    if (data.verified !== true) {
      alert("❌ User is not on the whitelist");
    } else {
      alert("✅ User is on the whitelist");
      mint(proof);
    }
  });
};

/*
    Params: Merkle Proof (Generated from Firebase Functions)
*/
const mint = async (proof) => {
  const options = {
    contractAddress: ContractAddress,
    functionName: "whitelistMint",
    abi: Abi,
    msgValue: ethers.utils
      .parseEther((0.05 * mintAmount).toString())
      .toString(),
    params: {
      _mintAmount: mintAmount,
      _merkleProof: proof,
    },
  };

  const transaction = await Moralis.executeFunction(options);
};
