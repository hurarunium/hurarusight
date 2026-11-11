import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkBreaks from 'remark-breaks';
import remarkSubtext from './src/plugins/remark-subtext.ts';
import remarkLinkCard from './src/plugins/remark-link-card.ts';
import { articlesDir, worksDir } from './src/utils/articlesDir.js';

// 記事が0本のまま公開されないよう、ビルドを止める
const articleFiles = readdirSync(articlesDir).filter((f) => f.endsWith('.md'));
if (articleFiles.length === 0) throw new Error(`記事が見つかりません: ${articlesDir}`);

// frontmatter の status が unlisted のページのURLを集める(サイトマップから除外するため)
// Works は0件でもよいので、フォルダが無ければ空として扱う
const isUnlisted = (file) => /^status:\s*unlisted\s*$/m.test(readFileSync(file, 'utf-8').split('---')[1] ?? '');
const unlistedPathsIn = (dir, urlBase, files) =>
  files.filter((f) => isUnlisted(`${dir}/${f}`)).map((f) => `/${urlBase}/${f.replace(/\.md$/, '')}/`);
const workFiles = existsSync(worksDir) ? readdirSync(worksDir).filter((f) => f.endsWith('.md')) : [];
const unlistedPaths = [
  ...unlistedPathsIn(articlesDir, 'articles', articleFiles),
  ...unlistedPathsIn(worksDir, 'works', workFiles),
];

export default defineConfig({
  site: 'https://huraru.com',
  // remark プラグイン(改行の反映・サブテキスト・リンクカード)を使うため、標準のSätteriではなく unified を使う
  markdown: { processor: unified({ remarkPlugins: [remarkBreaks, remarkSubtext, remarkLinkCard] }) },
  integrations: [
    sitemap({
      // 404ページと unlisted の記事・Works は検索に載せないので、サイトマップから除外する
      filter: (page) =>
        !page.endsWith('/404/') && !unlistedPaths.some((p) => page.endsWith(p)),
    }),
  ],
});
