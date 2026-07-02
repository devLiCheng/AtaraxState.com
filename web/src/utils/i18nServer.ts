import { headers, cookies } from 'next/headers';
import zh from '../locales/zh.json';
import en from '../locales/en.json';

export async function getLanguage(): Promise<'zh' | 'en'> {
  try {
    const cookieStore = await cookies();
    const langCookie = cookieStore.get('lang')?.value;
    if (langCookie === 'zh' || langCookie === 'en') {
      return langCookie as 'zh' | 'en';
    }
  } catch (e) {
    // In static rendering or some builds, cookies() might throw
  }

  try {
    const headerList = await headers();
    const acceptLanguage = headerList.get('accept-language') || '';
    if (acceptLanguage.includes('zh') || acceptLanguage.includes('cn')) {
      return 'zh';
    }
  } catch (e) {
    // Fail-safe
  }

  return 'en'; // Default
}

export async function getTranslations() {
  const lang = await getLanguage();
  return {
    lang,
    translations: lang === 'zh' ? zh : en,
  };
}
