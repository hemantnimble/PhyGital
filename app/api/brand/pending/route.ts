import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"

export async function GET() {
  const session = await auth()

  if (!session || !session.user.role.includes("ADMIN")) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    )
  }

  const brands = await db.brand.findMany({
    where: {
      verification: {
        status: "PENDING",
      },
    },
    include: {
      owner: {
        select: {
          name: true,
          email: true,
        },
      },
      verification: true,
    },
  })

  return NextResponse.json(brands)
}
