import { existsSync } from 'node:fs';
import { getCollection } from 'astro:content';
import { articlesRoot } from './articlesDir.js';

// 自己紹介(about.md)を返す。無いとき、または本番で draft のときは undefined(ページとメニューを出さない)
export async function getAbout() {
  // glob ローダーは、一致するファイルが0件のとき前回の内容をキャッシュに残すので、ファイルの有無は直接確かめる
  if (!existsSync(`${articlesRoot}/about.md`)) return undefined;
  const entries = await getCollection('about', (a) => import.meta.env.DEV || a.data.status !== 'draft');
  return entries[0];
}
