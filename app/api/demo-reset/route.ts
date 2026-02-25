import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"

// Protect this route — only you can call it
const RESET_SECRET = process.env.DEMO_RESET_SECRET || "reset-phygital-demo"

export async function POST(req: NextRequest) {
  const { secret } = await req.json()

  if (secret !== RESET_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const demoEmails = [
      "demo-admin@phygital.dev",
      "demo-brand@phygital.dev",
      "demo-user@phygital.dev",
    ]

    // Find all demo users
    const demoUsers = await db.user.findMany({
      where: { email: { in: demoEmails } },
    })

    const demoUserIds = demoUsers.map((u) => u.id)

    // Find demo brands
    const demoBrands = await db.brand.findMany({
      where: { ownerId: { in: demoUserIds } },
    })

    const demoBrandIds = demoBrands.map((b) => b.id)

    // Find demo products
    const demoProducts = await db.product.findMany({
      where: { brandId: { in: demoBrandIds } },
      include: {
        nftCertificate: true,
        identity: true,
        ownershipHistory: true,
      },
    })

    // Delete in correct order (children first)
    for (const product of demoProducts) {
      // Only delete DRAFT products — keep pre-minted ones intact
      if (!product.nftCertificate) {
        await db.verificationLog.deleteMany({ where: { productId: product.id } })
        await db.ownershipHistory.deleteMany({ where: { productId: product.id } })
        if (product.identity) {
          await db.productIdentity.delete({ where: { id: product.identity.id } })
        }
        await db.product.delete({ where: { id: product.id } })
      }
    }

    // Reset ownership history on pre-minted products back to brand wallet
    // (so demo user can claim again)
    for (const product of demoProducts) {
      if (product.nftCertificate) {
        // Delete claim/transfer history so product appears unclaimed again
        await db.ownershipHistory.deleteMany({
          where: {
            productId: product.id,
            fromAddress: { not: null }, // Keep only the original mint record
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Demo data reset successfully. Pre-minted products are preserved.",
      deletedDraftProducts: demoProducts.filter((p) => !p.nftCertificate).length,
      preservedMintedProducts: demoProducts.filter((p) => p.nftCertificate).length,
    })
  } catch (error: any) {
    console.error("Demo reset error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}