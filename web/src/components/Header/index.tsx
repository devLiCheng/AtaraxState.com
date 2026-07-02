'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '../../utils/i18nContext';
import { useCartStore } from '../../store/cartStore';
import { ShoppingBag, Menu, X } from 'lucide-react';

export interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { language, t, changeLanguage } = useI18n();
  const { items, hasHydrated } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const cartItemCount = hasHydrated ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const toggleLanguage = () => {
    changeLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <header className="atarax-header">
      <div className="header-container">
        {/* Mobile menu trigger */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand Logo */}
        <div className="brand-logo">
          <Link href="/">ATARAX STATE</Link>
        </div>

        {/* Desktop Nav */}
        <nav className={`desktop-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            {t('nav.home')}
          </Link>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)}>
            {t('nav.products')}
          </Link>
          <Link href="/journal" onClick={() => setMobileMenuOpen(false)}>
            {t('nav.journal')}
          </Link>
          
          {/* Mobile language switch inside mobile menu */}
          <button className="mobile-lang-btn" onClick={toggleLanguage}>
            {language === 'zh' ? 'EN' : '中文'}
          </button>
        </nav>

        {/* Header Right (Language Toggle & Cart) */}
        <div className="header-actions">
          <button className="lang-toggle-btn" onClick={toggleLanguage}>
            {language === 'zh' ? 'EN' : '中文'}
          </button>

          <button className="cart-trigger-btn" onClick={onOpenCart} aria-label="Open cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
