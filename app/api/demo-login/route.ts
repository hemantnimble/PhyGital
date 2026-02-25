import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { encode } from "next-auth/jwt"

const DEMO_ACCOUNTS = {
  admin: {
    email: "demo-admin@phygital.dev",
    name: "Demo Admin",
    role: "ADMIN" as const,
    redirectTo: "/dashboard",
  },
  brand: {
    email: "demo-brand@phygital.dev",
    name: "Demo Brand Co.",
    role: "BRAND" as const,
    redirectTo: "/dashboard",
  },
  user: {
    email: "demo-user@phygital.dev",
    name: "Demo User",
    role: "USER" as const,
    redirectTo: "/scanQr",
  },
}

export async function POST(req: NextRequest) {
  const { role } = await req.json()

  const accountConfig = DEMO_ACCOUNTS[role as keyof typeof DEMO_ACCOUNTS]
  if (!accountConfig) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  }

  try {
    // 1. Upsert demo user in DB
    let user = await db.user.findUnique({
      where: { email: accountConfig.email },
    })

    if (!user) {
      user = await db.user.create({
        data: {
          email: accountConfig.email,
          name: accountConfig.name,
          role: accountConfig.role,
          emailVerified: new Date(),
        },
      })
    } else {
      user = await db.user.update({
        where: { id: user.id },
        data: { role: accountConfig.role },
      })
    }

    // 2. If brand → ensure demo brand exists and is verified
    if (role === "brand") {
      const existingBrand = await db.brand.findUnique({
        where: { ownerId: user.id },
      })

      if (!existingBrand) {
        const brand = await db.brand.create({
          data: {
            name: "Demo Brand Co.",
            description:
              "A premium demo brand showcasing Phygital's blockchain authentication. Products here are pre-verified on Sepolia testnet.",
            website: "https://demobrand.example.com",
            location: "Mumbai, India",
            walletAddress: process.env.DEMO_BRAND_WALLET || "",
            ownerId: user.id,
            verified: true,
          },
        })

        await db.brandVerification.create({
          data: {
            brandId: brand.id,
            status: "APPROVED",
            verifiedAt: new Date(),
          },
        })
      }
    }

    // 3. Mint JWT session — same format NextAuth uses internally
    const isProduction = process.env.NODE_ENV === "production"
    const cookieName = isProduction
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"

    const token = await encode({
      token: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? "",
        role: [accountConfig.role],
        sub: user.id,
      },
      secret: process.env.AUTH_SECRET!,
      salt: cookieName,
      maxAge: 60 * 60 * 2, // 2 hours
    })

    const response = NextResponse.json({
      success: true,
      redirectTo: accountConfig.redirectTo,
    })

    response.cookies.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 2,
    })

    return response
  } catch (error: any) {
    console.error("Demo login error:", error)
    return NextResponse.json(
      { error: "Failed to create demo session" },
      { status: 500 }
    )
  }
}