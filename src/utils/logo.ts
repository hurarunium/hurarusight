import { siteName } from '../data/content.ts';

// 現在地に合わせたロゴの表記(例: Articles 配下なら huraru(home.articles))。
// サイト名の title などは変えず、ロゴの表示にだけ使う
export function getLogoText(pathname: string): string {
  if (pathname.startsWith('/articles')) return 'huraru(home.articles)';
  if (pathname.startsWith('/works')) return 'huraru(home.works)';
  if (pathname.startsWith('/about')) return 'huraru(home.about)';
  return siteName;
}

// 記事の本文ページか(一覧 /articles/ は含めない)。本文の幅を狭める対象
export function isArticlePage(pathname: string): boolean {
  return /^\/articles\/[^/]+\/?$/.test(pathname);
}

// 文章を読むページか(記事の本文と About)。背景の演出を控えめにする対象
export function isReadingPage(pathname: string): boolean {
  return isArticlePage(pathname) || /^\/about\/?$/.test(pathname);
}
