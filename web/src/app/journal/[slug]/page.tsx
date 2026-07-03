import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '../../../utils/prisma';
import { getTranslations } from '../../../utils/i18nServer';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Force SSR to reflect MySQL changes instantly

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const article = await prisma.article.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!article) return {};

  return {
    title: `${article.titleEn} | Journal | AtaraxState`,
    description: article.summaryEn,
    keywords: article.keywords,
  };
}

// Simple Markdown to React Parser for custom-styled post body
function parseMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-4" />;
    
    // Headers
    if (trimmed.startsWith('### ')) {
      return <h3 key={idx}>{trimmed.substring(4)}</h3>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={idx}>{trimmed.substring(3)}</h2>;
    }
    if (trimmed.startsWith('# ')) {
      return <h1 key={idx}>{trimmed.substring(2)}</h1>;
    }
    
    // List item
    if (trimmed.startsWith('- ')) {
      return <li key={idx}>{trimmed.substring(2)}</li>;
    }

    // Bold tags
    // Simple inline Bold parser (replace **text** with <strong>text</strong>)
    if (trimmed.includes('**')) {
      const parts = trimmed.split('**');
      return (
        <p key={idx}>
          {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part)}
        </p>
      );
    }
    
    // Normal paragraph
    return <p key={idx}>{trimmed}</p>;
  });
}

export default async function JournalDetailPage({ params }: PageProps) {
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
  const article = await prisma.article.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!article) {
    notFound();
  }

  const title = lang === 'zh' ? article.titleZh : article.titleEn;
  const content = lang === 'zh' ? article.contentZh : article.contentEn;
  const date = new Date(article.createdAt).toLocaleDateString(
    lang === 'zh' ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="atarax-journal-detail">
      <Link href="/journal" className="back-link">
        <ArrowLeft size={16} className="mr-2" style={{ marginRight: '8px' }} />
        {t('journal.back')}
      </Link>

      <article>
        <header className="article-header">
          <span className="article-date">
            {t('journal.publishedAt')} {date}
          </span>
          <h1 className="article-title">{title}</h1>
        </header>

        <img 
          src={article.coverImage || '/images/articles/placeholder.png'} 
          alt={title} 
          className="article-cover"
        />

        <div className="article-body-content">
          {parseMarkdown(content)}
        </div>
      </article>
    </div>
  );
}
