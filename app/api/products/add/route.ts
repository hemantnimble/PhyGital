import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { title, price, category, images, stock } = await req.json();
        console.log(price,stock,title)

        // Convert `price` to Float and `stock` to Int
        const priceFloat = parseFloat(price);
        const stockInt = parseInt(stock, 10);

        if (isNaN(priceFloat) || isNaN(stockInt)) {
            return NextResponse.json({ message: 'Invalid price or stock value' }, { status: 400 });
        }

        const result = await prisma.products.create({
            data: {
                title,
                price: priceFloat,
                category,
                stock: stockInt,
                images,
            },
        });

        return NextResponse.json(result, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
