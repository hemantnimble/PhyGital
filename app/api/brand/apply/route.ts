import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/db"

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        )
    }

    const existing = await db.brand.findUnique({
        where: { ownerId: session.user.id },
    })

    if (existing) {
        return NextResponse.json(
            { error: "Brand already exists" },
            { status: 400 }
        )
    }

    const body = await req.json()

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
