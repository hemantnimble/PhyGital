import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, ProductStatus } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      description,
      images,
      productCode,
      brandId,
    } = body;

    // Basic validation
    if (!name || !productCode || !brandId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(images)) {
      return NextResponse.json(
        { message: 'Images must be an array' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        images,
        productCode,
        brandId,
        status: ProductStatus.DRAFT, // default, but explicit is clearer
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    // Handle unique constraint error (productCode)
    if (err.code === 'P2002') {
      return NextResponse.json(
        { message: 'Product code already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: err.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
