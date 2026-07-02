import { NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';

// GET all articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create article
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titleZh, titleEn, summaryZh, summaryEn, contentZh, contentEn, coverImage, slug, keywords } = body;

    const article = await prisma.article.create({
      data: {
        titleZh,
        titleEn,
        summaryZh,
        summaryEn,
        contentZh,
        contentEn,
        coverImage,
        slug,
        keywords,
      },
    });

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT update article
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required.' }, { status: 400 });
    }

    const body = await request.json();
    const { titleZh, titleEn, summaryZh, summaryEn, contentZh, contentEn, coverImage, slug, keywords } = body;

    const article = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        titleZh,
        titleEn,
        summaryZh,
        summaryEn,
        contentZh,
        contentEn,
        coverImage,
        slug,
        keywords,
      },
    });

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE article
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Article ID is required.' }, { status: 400 });
    }

    await prisma.article.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
