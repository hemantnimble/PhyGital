import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    const { id } = await req.json();

    if (!userId) {
        return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
    }


    try {
        const removeItem = await prisma.cartItem.delete({
            where: {
                id
            },
        })
        return NextResponse.json({ removeItem }, { status: 200 });

    } catch (err: any) {
        console.log(err)
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
