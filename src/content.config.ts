import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { articlesDir, worksDir } from './utils/articlesDir.js';

// 記事（1記事 = 1ファイル。書いたら完結する単発記事）
const articles = defineCollection({
  loader: glob({ pattern: '*.md', base: articlesDir }),
  schema: z.object({
    // URLはファイル名で決まる(/articles/<ファイル名>/)
    title: z.string(),
    // 検索結果やSNS共有に出る説明文(120字前後まで)
    description: z.string(),
    date: z.string(),
    // draft: 下書き(本番ビルドには出さない。devでは見える)
    // unlisted: 一覧(トップ・Articles)とサイトマップに出さず、検索にも載せない。URLを直接開けば読める
    // published: 公開
    status: z.enum(['draft', 'unlisted', 'published']).default('draft'),
    tags: z.array(z.string()).default([]),
  }),
});

// 実績(Works。1件 = 1ファイル。記事とは別のコレクションなので、タグも記事とは別に扱う)
const works = defineCollection({
  loader: glob({ pattern: '*.md', base: worksDir }),
  schema: z.object({
    // URLはファイル名で決まる(/works/<ファイル名>/)
    title: z.string(),
    // 一言の説明(一覧と検索結果・SNS共有に出る)
    description: z.string(),
    // いつの実績か(YYYY-MM または YYYY-MM-DD)。一覧の並び順に使う
    date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
    // 制作期間(例: 3ヶ月)。書いた文字をそのまま表示する。空欄(null)は「なし」として扱う
    period: z.string().nullish(),
    // 使った技術
    tech: z.array(z.string()).default([]),
    // 種類のタグ
    tags: z.array(z.string()).default([]),
    // GitHub・公開先・関連記事など。あるものだけ書く
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    // 記事と同じ意味(draft: 本番に出さない / unlisted: 一覧とサイトマップに出さない / published: 公開)
    status: z.enum(['draft', 'unlisted', 'published']).default('draft'),
  }),
});

export const collections = { articles, works };
