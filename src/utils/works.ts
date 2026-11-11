import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate } from './format.ts';

// 下書き(draft)は、開発中(dev)だけ表示し、本番ビルドには出さない(記事と同じ)
const isVisible = (w: CollectionEntry<'works'>) =>
  import.meta.env.DEV || w.data.status !== 'draft';

// URLを持つ実績(unlisted を含み、本番では draft を除く)
export async function getPublishedWorks() {
  return getCollection('works', isVisible);
}

// 一覧に出す実績(unlisted を除く)を、date の新しい順で返す
export async function getListedWorks() {
  const works = await getCollection('works', (w) => isVisible(w) && w.data.status !== 'unlisted');
  return works.sort((a, b) => b.data.date.localeCompare(a.data.date));
}

// 制作時期の表示("2026-10" と "3ヶ月" → "2026/10 · 3ヶ月")
export function formatWorkTime(work: CollectionEntry<'works'>) {
  const { date, period } = work.data;
  return period ? `${formatDate(date)} · ${period}` : formatDate(date);
}

// 外部のURLか(外部なら新しいタブで開く)
export const isExternal = (url: string) => /^https?:\/\//.test(url);
