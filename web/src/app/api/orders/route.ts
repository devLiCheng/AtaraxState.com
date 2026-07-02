import { NextResponse } from 'next/server';
import prisma from '../../../utils/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerAddress, items } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing shipping info or order items.' },
        { status: 400 }
      );
    }

    // Generate unique order number (e.g. ATARAX-2026-XXXXX)
    const timestamp = Date.now();
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNo = `ATARAX-${timestamp}-${random}`;

    // Compute total price and create transaction to save order + update inventory stock
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        // Fetch product to verify price & stock
        const product = await tx.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Product ${product.nameEn} is out of stock.`);
        }

        const price = Number(product.price);
        totalAmount += price * item.quantity;

        // Deduct inventory stock
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        orderItemsData.push({
          productId: item.id,
          quantity: item.quantity,
          price: price,
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNo,
          customerName,
          customerPhone,
          customerAddress,
          totalAmount,
          status: 'PAID', // In real world it would be PENDING until payment webhook, but since it is simulation, mark as PAID
          orderItems: {
            create: orderItemsData,
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
