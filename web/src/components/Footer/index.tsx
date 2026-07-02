'use client';

import React from 'react';
import { useI18n } from '../../utils/i18nContext';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="atarax-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h4>ATARAX STATE</h4>
            <p className="brand-philosophy">{t('home.subSlogan')}</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h5>{t('nav.products')}</h5>
              <ul>
                <li><a href="/products?category=bracelet">Bracelets / 手串</a></li>
                <li><a href="/products?category=necklace">Necklaces / 项链</a></li>
              </ul>
            </div>
            
            <div className="link-group">
              <h5>ATARAXIA</h5>
              <ul>
                <li><a href="/journal">{t('nav.journal')} / 宁静志</a></li>
                <li><a href="/about">About / 品牌故事</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">{t('home.footerText')}</p>
          <div className="footer-extra">
            <span>AtaraxState.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
