import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"
import { ProductStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

async function getBrandFromSession() {
  const session = await auth()

  if (!session || !session.user.role.includes("BRAND")) {
    return null
  }

  const brand = await db.brand.findUnique({
    where: { ownerId: session.user.id },
  })

  if (!brand || !brand.verified) {
    return null
  }

  return brand
}

/* ---------------- CREATE PRODUCT ---------------- */
export async function POST(req: Request) {
  const brand = await getBrandFromSession()
  if (!brand) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { name, description, images, productCode } = await req.json()

  if (!name || !productCode) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    )
  }

  if (!Array.isArray(images)) {
    return NextResponse.json(
      { message: "Images must be an array" },
      { status: 400 }
    )
  }

  try {
    const product = await db.product.create({
      data: {
        name,
        description,
        images,
        productCode,
        brandId: brand.id,
        status: ProductStatus.DRAFT,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { message: "Product code already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json({ message: "Error creating product" }, { status: 500 })
  }
}

export async function GET() {
  const brand = await getBrandFromSession()
  if (!brand) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const products = await db.product.findMany({
    where: { brandId: brand.id },
    orderBy: { createdAt: "desc" },
    include: {
      brand: {
        select: {
          walletAddress: true,
        },
      },
      nftCertificate: true,
    },
  })

  return NextResponse.json(products)
}

/* ---------------- UPDATE PRODUCT ---------------- */
export async function PATCH(req: Request) {
  const brand = await getBrandFromSession()
  if (!brand) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { id, name, description, images, status } = body

  // ✅ ACTIVATE PRODUCT
  if (status === "ACTIVE") {
    const product = await db.product.findFirst({
      where: {
        id,
        brandId: brand.id,
        status: "DRAFT",
      },
      include: { identity: true },
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found or already active" },
        { status: 404 }
      )
    }

    if (product.identity) {
      return NextResponse.json(
        { message: "Identity already exists" },
        { status: 400 }
      )
    }

    // ✅ CHANGED: Use productId as the identity value
    await db.$transaction([
      db.product.update({
        where: { id: product.id },
        data: { status: "ACTIVE" },
      }),

      db.productIdentity.create({
        data: {
          type: "QR",
          value: product.id, // ✅ Use productId instead of randomUUID
          productId: product.id,
        },
      }),
    ])

    // ✅ CHANGED: Return productId instead of identity
    return NextResponse.json({
      success: true,
      productId: product.id, // ✅ Frontend will use this for QR
    })
  }

  // 🟡 NORMAL UPDATE (existing logic)
  const updated = await db.product.updateMany({
    where: {
      id,
      brandId: brand.id,
    },
    data: {
      name,
      description,
      images,
    },
  })

  if (updated.count === 0) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

/* ---------------- DELETE PRODUCT ---------------- */
/* ---------------- DELETE PRODUCT ---------------- */
export async function DELETE(req: Request) {
  const brand = await getBrandFromSession()
  if (!brand) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()

  if (!id) {
    return NextResponse.json(
      { message: "Product ID required" },
      { status: 400 }
    )
  }

  // 1️⃣ Fetch product with all relations
  const product = await db.product.findFirst({
    where: {
      id,
      brandId: brand.id,
    },
    include: {
      identity: true,
      nftCertificate: true,
      ownershipHistory: true,
    },
  })

  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 })
  }

  // 2️⃣ If ACTIVE or has NFT → SOFT DELETE only
  if (product.status === "ACTIVE" || product.nftCertificate) {
    await db.product.update({
      where: { id: product.id },
      data: { status: "FLAGGED" },
    })

    return NextResponse.json({
      success: true,
      softDeleted: true,
      message: "Product marked as FLAGGED (soft delete). Cannot hard delete active/minted products.",
    })
  }

  // 3️⃣ DRAFT → HARD DELETE (with cascade)
  try {
    await db.$transaction(async (tx) => {
      // Delete in correct order (children first, then parent)

      // Delete ProductIdentity if exists
      if (product.identity) {
        await tx.productIdentity.delete({
          where: { id: product.identity.id },
        })
      }

      // Delete VerificationLogs if any
      await tx.verificationLog.deleteMany({
        where: { productId: product.id },
      })

      // Delete OwnershipHistory if any
      await tx.ownershipHistory.deleteMany({
        where: { productId: product.id },
      })

      // Delete NFTCertificate if exists (shouldn't for DRAFT, but just in case)
      await tx.nFTCertificate.deleteMany({
        where: { productId: product.id },
      })

      // Finally delete the Product
      await tx.product.delete({
        where: { id: product.id },
      })
    })

    return NextResponse.json({
      success: true,
      hardDeleted: true,
    })
  } catch (error: any) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    )
  }
}