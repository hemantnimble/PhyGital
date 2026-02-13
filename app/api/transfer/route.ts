import { NextRequest, NextResponse } from "next/server";
import { getWeb3, getContract, hashProductId, getPrivateKey, getServerAddress } from "@/utils/web3";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const { productId, fromWallet, toWallet } = await req.json();

  if (!productId || !fromWallet || !toWallet) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Validate addresses
  if (!fromWallet.match(/^0x[a-fA-F0-9]{40}$/) || !toWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    return NextResponse.json(
      { error: "Invalid Ethereum address format" },
      { status: 400 }
    );
  }

  try {
    // 1. Get product + verify NFT exists
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { nftCertificate: true },
    });

    if (!product || !product.nftCertificate) {
      return NextResponse.json(
        { error: "Product not found or not minted" },
        { status: 404 }
      );
    }

    // 2. Verify current owner on blockchain matches fromWallet
    const productHash = hashProductId(productId);
    const contract = getContract();

    // ✅ FIX: Web3.js v4 returns an object, not an array
    const result = await (contract.methods as any)
      .verifyCertificate(productHash)
      .call();

    const isValid = result[0] || result.isValid;
    const tokenId = result[1] || result.tokenId;
    const currentOwner = result[2] || result.currentOwner;

    if (!isValid) {
      return NextResponse.json(
        { error: "Certificate not found on blockchain" },
        { status: 404 }
      );
    }

    if (currentOwner.toLowerCase() !== fromWallet.toLowerCase()) {
      return NextResponse.json(
        { error: "You are not the current owner of this NFT" },
        { status: 403 }
      );
    }

    // 3. Transfer on blockchain
    const web3 = getWeb3();
    const privateKey = getPrivateKey();
    const serverAddress = getServerAddress();

    const txData = (contract.methods as any)
      .transferOwnership(tokenId.toString(), fromWallet, toWallet)
      .encodeABI();

    const nonce = await web3.eth.getTransactionCount(serverAddress, "latest");
    const gasPrice = await web3.eth.getGasPrice();

    const txObject = {
      to: process.env.CONTRACT_ADDRESS!,
      data: txData,
      gas: "200000",
      gasPrice: gasPrice.toString(),
      nonce: Number(nonce), // ✅ Convert to number
      chainId: 11155111,
    };

    const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction!);

    const txHash = receipt.transactionHash.toString();

    // 4. Record transfer in DB
    await db.ownershipHistory.create({
      data: {
        productId,
        fromAddress: fromWallet,
        toAddress: toWallet,
        txHash,
      },
    });

    return NextResponse.json({
      success: true,
      txHash,
      message: "Ownership transferred successfully!",
    });

  } catch (error: any) {
    console.error("Transfer failed:", error);
    return NextResponse.json(
      { error: error.message || "Transfer failed" },
      { status: 500 }
    );
  }
}