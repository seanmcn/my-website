import {defineConfig} from 'astro/config';
import {satteri} from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import {codeFrame, siteTheme} from './src/plugins/code-blocks.mjs';
import {
  emojiShortcodes,
  externalLinks,
  stickyPairs,
  unwrapImages,
  youTubeEmbeds,
} from './src/plugins/markdown.mjs';
import devPages from './src/integrations/dev-pages.mjs';
import redirects from './src/integrations/redirects.mjs';

export default defineConfig({
  site: 'https://seanmcn.com',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({
      features: {smartPunctuation: true},
      mdastPlugins: [
        youTubeEmbeds, unwrapImages, stickyPairs, emojiShortcodes,
      ],
      hastPlugins: [externalLinks],
    }),
    shikiConfig: {
      theme: siteTheme,
      langAlias: {console: 'bash', terminal: 'bash'},
      transformers: [codeFrame],
    },
    // Mermaid blocks stay as source; src/scripts/mermaid.js draws them.
    syntaxHighlight: {type: 'shiki', excludeLangs: ['mermaid', 'math']},
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      filter: page => new URL(page).pathname !== '/search/',
    }),
    redirects(),
    devPages(),
  ],
  vite: {
    css: {preprocessorOptions: {scss: {quietDeps: true}}},
  },
});
