import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
    const session = await auth();
    const userId = session?.user?.id;
    try {

        if (!userId) {
            return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
        }

        const { reviewId } = await req.json();

        if (!reviewId) {
            return NextResponse.json({ message: 'All address fields are required' }, { status: 400 });
        }


        const deletedReview = await prisma.review.delete({
            where: { id: reviewId },
        })

        return NextResponse.json({ message: 'Address deleted successfully', address: deletedReview });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
