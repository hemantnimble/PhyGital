import { NextRequest, NextResponse } from "next/server";
import { getContract, hashProductId } from "@/utils/web3";
import { db } from "@/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

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

  // 2. If no NFT certificate minted yet
  if (!product.nftCertificate) {
    return NextResponse.json({
      product,
      blockchain: {
        isAuthentic: false,
        reason: "No certificate minted yet",
        tokenId: null,
        currentOwner: null,
      },
    });
  }

  // 3. Hash productId (must match mint)
  const productHash = hashProductId(productId);

  // 4. Verify on-chain
  const contract = getContract();
  const result = await (contract.methods as any)
    .verifyCertificate(productHash)
    .call();

  const isAuthentic = result[0];
  const tokenId = result[1]?.toString();
  const currentOwner = result[2];

  // 5. Cross-check DB vs blockchain
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
}