import { NextRequest, NextResponse } from "next/server";
import { getContract, hashProductId } from "@/utils/web3";
import { db } from "@/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> } // ← Changed to Promise
) {
  const { productId } = await params; // ← Added await

  // 1. Get product from MongoDB with all relations
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      brand: true,
      nftCertificate: true,
      ownershipHistory: {
        orderBy: { transferredAt: "desc" },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 2. If no NFT certificate minted yet, return early
  if (!product.nftCertificate) {
    return NextResponse.json({
      product,
      blockchain: {
        isAuthentic: false,
        reason: "No certificate minted yet",
        tokenId: null,
        currentOwner: null,
        dbAndChainMatch: false,
      },
    });
  }

  try {
    // 3. Hash the product ID — same hash used during minting
    const productHash = hashProductId(productId);

    // 4. Ask the blockchain directly — is this hash registered?
    const contract = getContract();
    
    const result = await (contract.methods as any)
      .verifyCertificate(productHash)
      .call();

    const isAuthentic = result[0] || result.isValid;
    const tokenId = (result[1] || result.tokenId)?.toString();
    const currentOwner = result[2] || result.currentOwner;

    // 5. Cross-check: tokenId on blockchain must match what's in our DB
    const dbTokenId = product.nftCertificate.tokenId;
    const tokenMatch = tokenId === dbTokenId;

    return NextResponse.json({
      product,
      blockchain: {
        isAuthentic: isAuthentic && tokenMatch,
        tokenId,
        currentOwner,
        contractAddress: process.env.CONTRACT_ADDRESS,
        chain: "sepolia",
        dbAndChainMatch: tokenMatch,
      },
    });
  } catch (error: any) {
    console.error("Blockchain verification error:", error);
    
    // If blockchain call fails, still return product info but mark as unverified
    return NextResponse.json({
      product,
      blockchain: {
        isAuthentic: false,
        tokenId: product.nftCertificate.tokenId,
        currentOwner: null,
        contractAddress: process.env.CONTRACT_ADDRESS,
        chain: "sepolia",
        dbAndChainMatch: false,
        error: "Blockchain verification failed",
      },
    });
  }
}