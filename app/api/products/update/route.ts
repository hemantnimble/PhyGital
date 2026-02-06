import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
    const { id, title,stock, price, images } = await req.json();
    const priceFloat = parseFloat(price);
    const stockInt = parseInt(stock, 10);
    try {
        const updatedProduct = await prisma.products.update({
            where: {
                id: id,
            },
            data: {
                title,
                price:priceFloat,
                stock: stockInt,
                images,
            },
        });
        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
