'use client';

import React, { useState } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { useI18n } from '../../../utils/i18nContext';

interface ProductActionsProps {
  product: {
    id: number;
    nameZh: string;
    nameEn: string;
    price: number;
    images: string;
    stock: number;
  };
}

export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
  const { t } = useI18n();
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const handleAddToBag = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="pdp-actions">
      <button 
        className="add-to-bag-btn" 
        onClick={handleAddToBag}
        disabled={isOutOfStock}
      >
        {isOutOfStock ? t('pdp.outOfStock') : t('pdp.addToBag')}
      </button>

      {added && (
        <p className="pdp-added-toast">
          ✓ {t('pdp.added')}
        </p>
      )}
    </div>
  );
};

export default ProductActions;
