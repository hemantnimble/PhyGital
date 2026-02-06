import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('Request body:', body); 
        const { id } = body;

        // Delete related CartItems
        await prisma.cartItem.deleteMany({
            where: { productId: id },
        });

        // Delete related OrderItems
        await prisma.orderItem.deleteMany({
            where: { productId: id },
        });

        // Delete the product
        const deletedProduct = await prisma.products.delete({
            where: { id },
        });

        return NextResponse.json(deletedProduct, { status: 200 });
    } catch (err: any) {
        console.error('Error:', err.message); 
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
