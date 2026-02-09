import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const session = await auth()
  if (!session || !session.user.role.includes("ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const brand = await db.brand.findUnique({
    where: { id },
  })

  if (!brand) {
    return NextResponse.json(
      { error: "Brand not found" },
      { status: 404 }
    )
  }

  if (brand.verified) {
    return NextResponse.json(
      { error: "Brand already approved" },
      { status: 400 }
    )
  }

  await db.$transaction([
    db.brand.update({
      where: { id },
      data: { verified: true },
    }),

    db.user.update({
      where: { id: brand.ownerId },
      data: { role: "BRAND" },
    }),

    db.brandVerification.upsert({
      where: { brandId: id },
      update: {
        status: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: session.user.id,
      },
      create: {
        brandId: id,
        status: "APPROVED",
        verifiedAt: new Date(),
        verifiedBy: session.user.id,
      },
    }),
  ])

  return NextResponse.json({ success: true })
}
