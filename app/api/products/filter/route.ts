import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
export async function POST(req: NextRequest) {
        const { category } = await req.json();
        try {
            let products;
            if (category && category !== 'All') {
                products = await prisma.products.findMany({
                    where: { category: category as string },
                });
            } else {
                products = await prisma.products.findMany(); // Fetch all products
            }
            return NextResponse.json({products});
        } catch (error: any) {
            console.log("errrrr",error)
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }
