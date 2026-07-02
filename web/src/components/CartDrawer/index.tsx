'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import { useI18n } from '../../utils/i18nContext';
import { X, Trash2 } from 'lucide-react';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { language, t } = useI18n();
  const { items, removeItem, getTotalPrice, hasHydrated } = useCartStore();

  const priceSymbol = language === 'zh' ? '¥' : '$';
  
  // Disable body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="atarax-cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <h3>{t('cart.title')}</h3>
          <button className="close-btn" onClick={onClose} aria-label={t('cart.close')}>
            <X size={20} />
          </button>
        </div>

        {/* Content list */}
        <div className="drawer-body">
          {!hasHydrated || items.length === 0 ? (
            <div className="empty-cart-state">
              <p>{t('cart.empty')}</p>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map((item) => {
                const name = language === 'zh' ? item.nameZh : item.nameEn;
                return (
                  <div key={item.id} className="cart-item-row">
                    <img 
                      src={item.images || '/images/products/placeholder.jpg'} 
                      alt={name} 
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4 className="item-name">{name}</h4>
                      <p className="item-quantity-price">
                        {item.quantity} x {priceSymbol}{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      className="item-remove-btn" 
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with checkout */}
        {hasHydrated && items.length > 0 && (
          <div className="drawer-footer">
            <div className="subtotal-row">
              <span>{t('cart.subtotal')}</span>
              <span className="price">
                {priceSymbol}{getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <Link href="/checkout" onClick={onClose} className="checkout-btn">
              {t('cart.checkout')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
