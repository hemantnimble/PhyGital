import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"

export async function POST(req: Request) {
  const session = await auth()

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()

  const existingBrand = await db.brand.findUnique({
    where: { ownerId: session.user.id },
    include: { verification: true },
  })

  // 🟢 CASE 1: RE-APPLY (brand exists but rejected)
  if (
    existingBrand &&
    existingBrand.verification?.status === "REJECTED"
  ) {
    await db.$transaction([
      db.brand.update({
        where: { id: existingBrand.id },
        data: {
          name: body.name,
          description: body.description,
          website: body.website,
          location: body.location,
          walletAddress: body.walletAddress,
          verified: false,
        },
      }),

      db.brandVerification.update({
        where: { brandId: existingBrand.id },
        data: {
          status: "PENDING",
          notes: null,
          verifiedAt: null,
          verifiedBy: null,
        },
      }),
    ])

    return NextResponse.json({ success: true, reapply: true })
  }

  // 🔴 CASE 2: Brand already applied or approved
  if (existingBrand) {
    return NextResponse.json(
      { error: "Brand already exists" },
      { status: 400 }
    )
  }

  // 🆕 CASE 3: First-time apply
  const brand = await db.brand.create({
    data: {
      name: body.name,
      description: body.description,
      website: body.website,
      location: body.location,
      walletAddress: body.walletAddress,
      ownerId: session.user.id,
      verified: false,
    },
  })

  await db.brandVerification.create({
    data: {
      brandId: brand.id,
      status: "PENDING",
    },
  })

  return NextResponse.json({ success: true })
}
