import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const session = await auth()
  if (!session || !session.user.role.includes("ADMIN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await req.json().catch(() => ({}))
  const note = body?.note ?? null

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
      { error: "Verified brand cannot be rejected" },
      { status: 400 }
    )
  }

  await db.$transaction([
    db.brand.update({
      where: { id },
      data: { verified: false },
    }),

    db.brandVerification.upsert({
      where: { brandId: id },
      update: {
        status: "REJECTED",
        notes: note,
        verifiedAt: new Date(),
        verifiedBy: session.user.id,
      },
      create: {
        brandId: id,
        status: "REJECTED",
        notes: note,
        verifiedAt: new Date(),
        verifiedBy: session.user.id,
      },
    }),
  ])

  return NextResponse.json({ success: true })
}
