import React from 'react';
import Link from 'next/link';
import prisma from '../../utils/prisma';
import { getTranslations } from '../../utils/i18nServer';
import ProductCard from '../../components/ProductCard';

export const dynamic = 'force-dynamic'; // Force SSR to reflect MySQL edits instantly

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { lang, translations } = await getTranslations();
  
  // Resolve translation helper
  const t = (key: string) => {
    const keys = key.split('.');
    let val: any = translations;
    for (const k of keys) {
      val = val?.[k];
    }
    return typeof val === 'string' ? val : key;
  };

  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.category;

  // Query database
  const products = await prisma.product.findMany({
    where: categoryFilter ? { category: categoryFilter } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="atarax-collection-page">
      <div className="collection-header">
        <h1 className="collection-title">{t('nav.products')}</h1>
        <div className="category-filters">
          <Link 
            href="/products" 
            className={!categoryFilter ? 'active' : ''}
          >
            {lang === 'zh' ? '全部' : 'All'}
          </Link>
          <Link 
            href="/products?category=bracelet" 
            className={categoryFilter === 'bracelet' ? 'active' : ''}
          >
            {lang === 'zh' ? '手串' : 'Bracelets'}
          </Link>
          <Link 
            href="/products?category=necklace" 
            className={categoryFilter === 'necklace' ? 'active' : ''}
          >
            {lang === 'zh' ? '项链' : 'Necklaces'}
          </Link>
        </div>
      </div>

      <div className="collection-grid">
        {products.length === 0 ? (
          <div className="no-products">
            {lang === 'zh' ? '没有找到相关商品。' : 'No products found.'}
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={{
              id: product.id,
              nameZh: product.nameZh,
              nameEn: product.nameEn,
              price: product.price,
              images: product.images,
              category: product.category,
            }} />
          ))
        )}
      </div>
    </div>
  );
}
