'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import { useI18n } from '../../utils/i18nContext';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutPage() {
  const { language, t } = useI18n();
  const { items, getTotalPrice, clearCart, hasHydrated } = useCartStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successOrder, setSuccessOrder] = useState<any>(null);

  const priceSymbol = language === 'zh' ? '¥' : '$';
  
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      setErrorMsg(language === 'zh' ? '请填写所有收货字段。' : 'Please fill all shipping fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          items: items.map(item => ({ id: item.id, quantity: item.quantity })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      // Success
      setSuccessOrder(data);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If order was successfully submitted, show thank you state
  if (successOrder) {
    return (
      <div className="atarax-checkout-page">
        <div className="checkout-success">
          <div className="success-icon">
            <CheckCircle2 size={64} strokeWidth={1} />
          </div>
          <h2>{t('checkout.success')}</h2>
          <p>{t('checkout.successDesc')}</p>

          <div className="order-details-card">
            <div className="row">
              <span className="label">{t('checkout.orderNo')}</span>
              <span>{successOrder.orderNo}</span>
            </div>
            <div className="row">
              <span className="label">{t('checkout.name')}</span>
              <span>{successOrder.customerName}</span>
            </div>
            <div className="row">
              <span className="label">{t('checkout.phone')}</span>
              <span>{successOrder.customerPhone}</span>
            </div>
            <div className="row">
              <span className="label">{t('checkout.address')}</span>
              <span>{successOrder.customerAddress}</span>
            </div>
            <div className="row">
              <span className="label">{t('cart.subtotal')}</span>
              <span>{priceSymbol}{Number(successOrder.totalAmount).toFixed(2)}</span>
            </div>
          </div>

          <Link href="/" className="home-btn">
            {language === 'zh' ? '返回首页' : 'Return Home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="atarax-checkout-page">
      <h1 className="checkout-title">{t('checkout.title')}</h1>

      {!hasHydrated || items.length === 0 ? (
        <div className="text-center py-20 font-sans" style={{ textAlign: 'center', padding: '80px 0' }}>
          <p className="mb-8" style={{ marginBottom: '32px' }}>{t('cart.empty')}</p>
          <Link href="/products" className="inline-block bg-zinc-900 text-white px-8 py-3 uppercase tracking-wider font-sans text-xs" style={{ background: '#2A2A2A', color: '#F4F3F0', padding: '12px 24px', textTransform: 'uppercase', textDecoration: 'none', letterSpacing: '1px', fontSize: '12px' }}>
            {t('home.viewCollection')}
          </Link>
        </div>
      ) : (
        <div className="checkout-container">
          {/* Shipping Form */}
          <form className="checkout-form" onSubmit={handleCheckout}>
            {errorMsg && <p style={{ color: '#b91c1c', fontSize: '13px' }}>{errorMsg}</p>}
            
            <div className="form-group">
              <label htmlFor="name">{t('checkout.name')}</label>
              <input 
                id="name" 
                type="text" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('checkout.phone')}</label>
              <input 
                id="phone" 
                type="text" 
                value={customerPhone} 
                onChange={(e) => setCustomerPhone(e.target.value)} 
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">{t('checkout.address')}</label>
              <textarea 
                id="address" 
                value={customerAddress} 
                onChange={(e) => setCustomerAddress(e.target.value)} 
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-order-btn" 
              disabled={loading}
            >
              {loading ? t('checkout.processing') : t('checkout.submit')}
            </button>
          </form>

          {/* Cart Summary */}
          <div className="checkout-summary">
            <h3>{t('cart.title')}</h3>
            <div className="summary-items">
              {items.map((item) => (
                <div key={item.id} className="summary-item-row">
                  <span className="item-name">
                    {language === 'zh' ? item.nameZh : item.nameEn}
                  </span>
                  <span className="item-qty-price">
                    {item.quantity} x {priceSymbol}{item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>{t('cart.subtotal')}</span>
              <span className="price">{priceSymbol}{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
