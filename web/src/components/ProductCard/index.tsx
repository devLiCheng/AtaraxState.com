'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '../../utils/i18nContext';

export interface ProductCardProps {
  product: {
    id: number;
    nameZh: string;
    nameEn: string;
    price: any;
    images: string;
    category: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t } = useI18n();

  const name = language === 'zh' ? product.nameZh : product.nameEn;
  const priceSymbol = language === 'zh' ? '¥' : '$';
  
  // Format price beautifully
  const formattedPrice = Number(product.price).toFixed(2);

  return (
    <div className="atarax-product-card">
      <Link href={`/products/${product.id}`} className="card-link">
        <div className="product-image-wrapper">
          {/* Fallback color/gradient block or actual image */}
          <img 
            src={product.images || '/images/products/placeholder.jpg'} 
            alt={name}
            className="product-image"
            loading="lazy"
          />
          <div className="image-overlay">
            <span className="view-detail-txt">{t('journal.readMore')}</span>
          </div>
        </div>
        
        <div className="product-info">
          <h4 className="product-title">{name}</h4>
          <p className="product-price">{priceSymbol}{formattedPrice}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
