import {defineConfig, fontProviders} from 'astro/config';
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
  // Downloaded at build time and served from _astro/ with the rest of the
  // site, so pages don't wait on a stylesheet from Google before rendering.
  // optimizedFallbacks is off because the arrows and bullets in the UI
  // aren't in these fonts: they come from the next font in the stack, and
  // Astro's metric-matched Times New Roman and Courier New draw them thinner
  // than Georgia and Menlo do.
  fonts: [
    {
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      provider: fontProviders.google(),
      weights: [400, 600, 700],
      styles: ['normal'],
      fallbacks: ['georgia', 'Times New Roman', 'serif'],
      optimizedFallbacks: false,
      options: {experimental: {variableAxis: {opsz: [['8', '60']]}}},
    },
    {
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.google(),
      weights: [400, 500],
      styles: ['normal'],
      fallbacks: ['SFMono-Regular', 'menlo', 'consolas', 'monospace'],
      optimizedFallbacks: false,
    },
    {
      name: 'Kalam',
      cssVariable: '--font-hand',
      provider: fontProviders.google(),
      weights: [400],
      styles: ['normal'],
      fallbacks: ['cursive'],
      optimizedFallbacks: false,
    },
  ],
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
