import React from 'react';
import Link from 'next/link';
import prisma from '../../utils/prisma';
import { getTranslations } from '../../utils/i18nServer';

export const revalidate = 0; // Force SSR to reflect MySQL changes instantly

export default async function JournalPage() {
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

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="atarax-journal-archive">
      <div className="journal-header">
        <h1 className="journal-title">{t('journal.title')}</h1>
        <p className="journal-subtitle">{t('journal.subtitle')}</p>
      </div>

      <div className="archive-grid">
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
              className="archive-card"
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
    </div>
  );
}
