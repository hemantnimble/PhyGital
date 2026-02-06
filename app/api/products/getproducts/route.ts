import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';
export async function GET() {
    try {
        const products = await prisma?.products.findMany()
        return NextResponse.json({
            products
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }
}