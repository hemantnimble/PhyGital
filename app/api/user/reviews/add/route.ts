import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    try {
        if (!userId) return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
        const { content, rating, productId } = await req.json();

        const review = await prisma.review.create({
            data: {
                content,
                rating,
                product: { connect: { id: productId } },
                user: { connect: { id: userId } },
            },
        });
        return NextResponse.json({ message: 'Address added successfully', review });
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
