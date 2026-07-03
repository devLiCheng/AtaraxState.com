import React from 'react';
import Link from 'next/link';
import prisma from '../utils/prisma';
import { getTranslations } from '../utils/i18nServer';
import ProductCard from '../components/ProductCard';

export const dynamic = 'force-dynamic'; // Force SSR to reflect MySQL changes instantly

export default async function Home() {
  const { lang, translations } = await getTranslations();
  
  // Helper to resolve translation keys on the server
  const t = (key: string) => {
    const keys = key.split('.');
    let val: any = translations;
    for (const k of keys) {
      val = val?.[k];
    }
    return typeof val === 'string' ? val : key;
  };

  // Fetch 3 featured products and 2 articles from local MySQL
  const products = await prisma.product.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const articles = await prisma.article.findMany({
    take: 2,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="atarax-home-page">
      {/* Hero Section */}
      <section 
        className="hero-section" 
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{t('home.slogan')}</h1>
          <p className="hero-subtitle">{t('home.subSlogan')}</p>
          <Link href="/products" className="hero-btn">
            {t('home.viewCollection')}
          </Link>
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <div className="quote-content">
          <p className="quote-text">
            {lang === 'zh' 
              ? "“灵魂的宁静，是在巨浪翻滚的尘世里，为心房留出的一寸空白。”" 
              : "“Tranquility is not the absence of storm, but the peace at the center of it.”"}
          </p>
          <span className="quote-author">Epicurus / 伊壁鸠鲁</span>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <h2 className="section-title">{t('home.featuredProducts')}</h2>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={{
              id: product.id,
              nameZh: product.nameZh,
              nameEn: product.nameEn,
              price: product.price,
              images: product.images,
              category: product.category,
            }} />
          ))}
        </div>
      </section>

      {/* Journal Section */}
      <section className="journal-section">
        <h2 className="section-title">{t('home.featuredJournal')}</h2>
        <div className="journal-grid">
          {articles.map((article) => {
            const title = lang === 'zh' ? article.titleZh : article.titleEn;
            const summary = lang === 'zh' ? article.summaryZh : article.summaryEn;
            const date = new Date(article.createdAt).toLocaleDateString(
              lang === 'zh' ? 'zh-CN' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            );

            return (
              <Link 
                key={article.id} 
                href={`/journal/${article.slug}`} 
                className="journal-card"
              >
                <img 
                  src={article.coverImage || '/images/articles/placeholder.png'} 
                  alt={title} 
                  className="article-image"
                />
                <div className="article-info">
                  <span className="article-date">
                    {t('journal.publishedAt')} {date}
                  </span>
                  <h3 className="article-title">{title}</h3>
                  <p className="article-summary">{summary}</p>
                  <span className="article-link">{t('journal.readMore')}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
