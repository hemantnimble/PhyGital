import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;

    // Return an error response if userId is not defined
    if (!userId) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }

    const { id, quantity } = await req.json();

    try {
        const cartItem = await prisma.cartItem.upsert({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId:id,
                },
            },
            update: {
                quantity,
            },
            create: {
                userId: session.user.id,
                productId:id,
                quantity,
            },
        });
        return NextResponse.json({ cartItem }, { status: 200 });

    } catch (err:any) {
        console.log(err)
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
