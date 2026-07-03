import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '../../../utils/prisma';
import { getTranslations } from '../../../utils/i18nServer';
import ProductActions from './ProductActions';

export const dynamic = 'force-dynamic'; // Force SSR to reflect MySQL edits instantly

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(resolvedParams.id) },
  });

  if (!product) return {};

  return {
    title: `${product.nameEn} | AtaraxState`,
    description: product.storyEn,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
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

  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(resolvedParams.id) },
  });

  if (!product) {
    notFound();
  }

  const name = lang === 'zh' ? product.nameZh : product.nameEn;
  const story = lang === 'zh' ? product.storyZh : product.storyEn;
  const detailsRaw = lang === 'zh' ? product.detailsZh : product.detailsEn;
  const care = lang === 'zh' ? product.careZh : product.careEn;
  
  // Split specs by "|" or newline
  const specs = detailsRaw.split(/[|\n]+/).map(s => s.trim()).filter(Boolean);

  const priceSymbol = lang === 'zh' ? '¥' : '$';
  const formattedPrice = Number(product.price).toFixed(2);

  return (
    <div className="atarax-pdp-page">
      {/* Left Side: Images */}
      <div className="pdp-gallery">
        <div className="pdp-main-image-wrapper">
          <img 
            src={product.images || '/images/products/placeholder.png'} 
            alt={name} 
          />
        </div>
      </div>

      {/* Right Side: Details */}
      <div className="pdp-details">
        <h1 className="product-title">{name}</h1>
        <p className="product-price">{priceSymbol}{formattedPrice}</p>

        {/* Story Module */}
        <div className="detail-module">
          <h5>{t('pdp.story')}</h5>
          <p className="story-text">{story}</p>
        </div>

        {/* Specs Module */}
        <div className="detail-module">
          <h5>{t('pdp.details')}</h5>
          <div className="specs-list">
            {specs.map((spec, idx) => (
              <span key={idx} className="spec-item">{spec}</span>
            ))}
          </div>
        </div>

        {/* Care Module */}
        <div className="detail-module">
          <h5>{t('pdp.care')}</h5>
          <p className="care-instructions">{care}</p>
        </div>

        {/* Actions (Add to Bag button) */}
        <ProductActions product={{
          id: product.id,
          nameZh: product.nameZh,
          nameEn: product.nameEn,
          price: Number(product.price),
          images: product.images,
          stock: product.stock,
        }} />
      </div>
    </div>
  );
}
