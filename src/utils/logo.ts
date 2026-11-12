import { siteName } from '../data/content.ts';

// 現在地に合わせたロゴの表記(例: Articles 配下なら huraru(home.articles))。
// サイト名の title などは変えず、ロゴの表示にだけ使う
export function getLogoText(pathname: string): string {
  if (pathname.startsWith('/articles')) return 'huraru(home.articles)';
  if (pathname.startsWith('/works')) return 'huraru(home.works)';
  return siteName;
}

// 記事の本文ページか(一覧 /articles/ は含めない)。背景の演出の強さを切り替える対象
export function isArticlePage(pathname: string): boolean {
  return /^\/articles\/[^/]+\/?$/.test(pathname);
}
