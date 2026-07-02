import { NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';

// GET all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nameZh, nameEn, price, storyZh, storyEn, detailsZh, detailsEn, careZh, careEn, images, category, stock } = body;

    const product = await prisma.product.create({
      data: {
        nameZh,
        nameEn,
        price: Number(price),
        storyZh,
        storyEn,
        detailsZh,
        detailsEn,
        careZh,
        careEn,
        images,
        category,
        stock: Number(stock),
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update product
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const body = await request.json();
    const { nameZh, nameEn, price, storyZh, storyEn, detailsZh, detailsEn, careZh, careEn, images, category, stock } = body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        nameZh,
        nameEn,
        price: price !== undefined ? Number(price) : undefined,
        storyZh,
        storyEn,
        detailsZh,
        detailsEn,
        careZh,
        careEn,
        images,
        category,
        stock: stock !== undefined ? Number(stock) : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    // Delete related OrderItems first if necessary, or let foreign keys handle it.
    // In our schema, OrderItem -> Product doesn't have cascade delete, so we must either delete or check.
    // For simplicity, delete related order items first, or throw if ordered.
    await prisma.orderItem.deleteMany({
      where: { productId: Number(id) },
    });

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
