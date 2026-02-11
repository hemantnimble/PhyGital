import { NextRequest, NextResponse } from "next/server";
import {
  getWeb3,
  getContract,
  hashProductId,
  getPrivateKey,
  getServerAddress,
} from "@/utils/web3";
import { auth } from "@/auth";
import { db } from "@/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, brandWalletAddress } = await req.json();

  if (!productId || !brandWalletAddress) {
    return NextResponse.json(
      { error: "Missing productId or brandWalletAddress" },
      { status: 400 }
    );
  }

  try {
    // 1. Check product exists + not already minted
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { brand: true, nftCertificate: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.nftCertificate) {
      return NextResponse.json(
        { error: "Certificate already minted for this product" },
        { status: 409 }
      );
    }

    // 2. Hash the product ID
    const productHash = hashProductId(productId);

    // 3. Get web3 + contract + keys
    const web3 = getWeb3();
    const contract = getContract();
    const privateKey = getPrivateKey();
    const serverAddress = getServerAddress();

    // 4. Encode the contract function call
    const txData = (contract.methods as any)
      .mintCertificate(brandWalletAddress, productHash)
      .encodeABI();

    // 5. Get nonce + gas price
    const nonce = await web3.eth.getTransactionCount(serverAddress, "latest");
    const gasPrice = await web3.eth.getGasPrice();

    // 6. Build transaction
    const txObject = {
      to: process.env.CONTRACT_ADDRESS!,
      data: txData,
      gas: "300000",
      gasPrice: gasPrice.toString(),
      nonce: nonce,
      chainId: 11155111,
    };

    // 7. Sign + send
    const signedTx = await web3.eth.accounts.signTransaction(
      txObject,
      privateKey
    );
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction!
    );

    const txHash = receipt.transactionHash.toString();

    // 8. ─────────────────────────────────────────────────────
    //    Web3.js v4 does NOT decode events on sendSignedTransaction
    //    So we decode the logs manually from the receipt
    // ─────────────────────────────────────────────────────────

    // The keccak256 signature of our event:
    // CertificateMinted(uint256,bytes32,address)
    const EVENT_SIGNATURE = web3.utils.keccak256(
      "CertificateMinted(uint256,bytes32,address)"
    );

    // Find the log that matches our event
    const mintLog = receipt.logs.find(
      (log) =>
        log.topics &&
        log.topics[0]?.toString().toLowerCase() ===
        EVENT_SIGNATURE.toLowerCase()
    );

    if (!mintLog) {
      throw new Error(
        `Transaction succeeded (${txHash}) but CertificateMinted event not found in logs. Check your contract ABI matches deployed contract.`
      );
    }

    // Decode the log using the contract ABI
    const decoded = web3.eth.abi.decodeLog(
      [
        { type: "uint256", name: "tokenId", indexed: true },
        { type: "bytes32", name: "productHash", indexed: false },
        { type: "address", name: "brand", indexed: true },
      ],
      mintLog.data as string,
      (mintLog.topics as string[]).slice(1) // skip topics[0] which is the event signature
    );

    const tokenId = (decoded as any).tokenId as string;

    // 9. Save NFTCertificate to MongoDB
    const certificate = await db.nFTCertificate.create({
      data: {
        productId,
        contractAddress: process.env.CONTRACT_ADDRESS!,
        tokenId,
        chain: "sepolia",
      },
    });

    // 10. Record first ownership entry
    await db.ownershipHistory.create({
      data: {
        productId,
        fromAddress: null,
        toAddress: brandWalletAddress,
        txHash,
      },
    });

    return NextResponse.json({
      success: true,
      tokenId,
      txHash,
      certificate,
    });
  } catch (error: any) {
    console.error("Mint failed:", error);
    return NextResponse.json(
      { error: error.message || "Mint failed" },
      { status: 500 }
    );
  }
}