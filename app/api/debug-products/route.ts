import { NextResponse } from "next/server";
import { db } from "@/db";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Login first" }, { status: 401 });

  const products = await db.product.findMany({
    take: 5,
    include: { brand: true, nftCertificate: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    products.map(p => ({
      id: p.id,
      name: p.name,
      brandWallet: p.brand.walletAddress,
      alreadyMinted: !!p.nftCertificate,
    }))
  );
}