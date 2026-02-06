import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    const { id, stock } = await req.json();

    const stockInt = parseInt(stock, 10);


    try {
        const updatedProduct = await prisma.products.update({
            where: {
                id: id,
            },
            data: {
                stock: stockInt,  
            },
        });
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
