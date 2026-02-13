import { NextRequest, NextResponse } from "next/server";
import { getWeb3, getContract, hashProductId, getPrivateKey, getServerAddress } from "@/utils/web3";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const { productId, newOwnerWallet } = await req.json();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔍 CLAIM DEBUG - START");
  console.log("productId:", productId);
  console.log("newOwnerWallet:", newOwnerWallet);

  if (!productId || !newOwnerWallet) {
    return NextResponse.json(
      { error: "Missing productId or newOwnerWallet" },
      { status: 400 }
    );
  }

  if (!newOwnerWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    return NextResponse.json(
      { error: "Invalid Ethereum address format" },
      { status: 400 }
    );
  }

  try {
    // 1. Get product + NFT certificate
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        nftCertificate: true,
        brand: true,
        ownershipHistory: { orderBy: { transferredAt: "desc" }, take: 1 },
      },
    });

    if (!product || !product.nftCertificate) {
      return NextResponse.json(
        { error: "Product not found or not minted" },
        { status: 404 }
      );
    }

    console.log("✅ Product found:", product.name);
    console.log("✅ NFT exists - Token ID:", product.nftCertificate.tokenId);
    console.log("✅ Brand wallet from DB:", product.brand.walletAddress);

    // 2. Check current owner on blockchain
    const productHash = hashProductId(productId);
    console.log("🔐 Product hash:", productHash);

    const contract = getContract();
    console.log("📜 Contract address:", process.env.CONTRACT_ADDRESS);

    const result = await (contract.methods as any)
      .verifyCertificate(productHash)
      .call();

    console.log("🔗 Raw blockchain result:", result);

    const isValid = result[0] || result.isValid;
    const tokenId = result[1] || result.tokenId;
    const currentOwner = result[2] || result.currentOwner;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("BLOCKCHAIN STATE:");
    console.log("  isValid:", isValid);
    console.log("  tokenId:", tokenId?.toString());
    console.log("  currentOwner:", currentOwner);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    if (!isValid) {
      return NextResponse.json(
        { error: "Certificate not found on blockchain" },
        { status: 404 }
      );
    }

    // 3. Check if already claimed
    const brandWallet = product.brand.walletAddress?.toLowerCase();
    const blockchainOwner = currentOwner.toLowerCase();

    console.log("🔍 OWNERSHIP CHECK:");
    console.log("  Brand wallet (DB):", brandWallet);
    console.log("  Blockchain owner:", blockchainOwner);
    console.log("  Match?", blockchainOwner === brandWallet);

    if (blockchainOwner !== brandWallet) {
      return NextResponse.json(
        { error: `Already claimed. Current owner: ${currentOwner}` },
        { status: 409 }
      );
    }

    // 4. Prepare transfer
    const web3 = getWeb3();
    const privateKey = getPrivateKey();
    const serverAddress = getServerAddress();

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("TRANSFER PARAMETERS:");
    console.log("  tokenId:", tokenId?.toString());
    console.log("  from (brand):", brandWallet);
    console.log("  to (new owner):", newOwnerWallet);
    console.log("  server address:", serverAddress);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // CRITICAL: Encode the transaction
    const txData = (contract.methods as any)
      .transferOwnership(tokenId.toString(), brandWallet, newOwnerWallet)
      .encodeABI();

    console.log("📝 Encoded transaction data:", txData);

    const nonce = await web3.eth.getTransactionCount(serverAddress, "latest");
    const gasPrice = await web3.eth.getGasPrice();

    console.log("⛽ Gas price:", gasPrice.toString());
    console.log("🔢 Nonce:", Number(nonce)); // ✅ Convert to number for logging

    const txObject = {
      to: process.env.CONTRACT_ADDRESS!,
      data: txData,
      gas: "200000",
      gasPrice: gasPrice.toString(),
      nonce: Number(nonce), // ✅ Convert BigInt to number
      chainId: 11155111,
    };

    console.log("📦 Full transaction object:", JSON.stringify(txObject, null, 2));

    console.log("🔐 Signing transaction...");
    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

    console.log("📡 Sending signed transaction...");
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction!);

    const txHash = receipt.transactionHash.toString();
    console.log("✅ Transaction successful!");
    console.log("📜 TX Hash:", txHash);

    // 5. Record in DB
    await db.ownershipHistory.create({
      data: {
        productId,
        fromAddress: brandWallet!,
        toAddress: newOwnerWallet,
        txHash,
      },
    });

    console.log("✅ CLAIM COMPLETE");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({
      success: true,
      txHash,
      message: "Ownership claimed successfully!",
    });

  } catch (error: any) {
    console.error("❌ CLAIM FAILED:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json(
      { error: error.message || "Claim failed" },
      { status: 500 }
    );
  }
}
