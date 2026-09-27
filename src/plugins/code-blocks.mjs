/*
 * Code listings, highlighted by Shiki at build time. What code.js did with
 * react-syntax-highlighter in the browser: the same palette (colours are the
 * site's CSS variables, so one theme covers light and dark) and the same
 * ruled head with the language and a copy button. The copy button's
 * behaviour is in src/scripts/code-blocks.js.
 */

const SHELL_LANGUAGES = new Set([
  'bash', 'console', 'sh', 'shell', 'shellscript', 'terminal', 'zsh',
]);

export function languageLabel(lang) {
  const language = (lang || '').toLowerCase().trim();

  if (SHELL_LANGUAGES.has(language)) {
    return 'bash';
  }

  if (!language || language === 'plaintext' || language === 'txt') {
    return 'text';
  }

  return language;
}

const rule = (scope, foreground, fontStyle) => ({
  scope,
  settings: fontStyle ? {foreground, fontStyle} : {foreground},
});

export const siteTheme = {
  name: 'seanmcn',
  type: 'light',
  colors: {
    'editor.foreground': 'var(--ink)',
    'editor.background': 'transparent',
  },
  tokenColors: [
    rule(['comment', 'punctuation.definition.comment'], 'var(--faint)',
        'italic'),
    rule([
      'punctuation', 'keyword.operator', 'variable', 'variable.other',
      'constant.character.entity', 'markup.underline.link',
      'markup.deleted', 'meta.embedded',
    ], 'var(--ink-2)'),
    rule([
      'string', 'constant.character', 'constant.numeric',
      'string.regexp', 'markup.inserted', 'string.quoted',
    ], 'var(--amber)'),
    rule([
      'keyword', 'storage', 'storage.type', 'constant.language.boolean',
      'constant.language', 'entity.name.function', 'support.function',
      'entity.name.tag', 'entity.other.attribute-name.class',
      'entity.other.attribute-name.id', 'keyword.control',
      'support.type.property-name.css', 'meta.selector',
    ], 'var(--accent)'),
    rule([
      'entity.name.type', 'entity.name.class', 'support.class',
      'entity.other.attribute-name', 'variable.other.property',
      'support.type.property-name', 'variable.other.constant',
      'constant.other', 'variable.parameter', 'keyword.other.important',
      // Command-line flags, which the Prism setup highlighted by hand.
      'constant.other.option',
    ], 'var(--plum)'),
  ],
};

const copyIcon = {
  type: 'element',
  tagName: 'svg',
  properties: {
    'aria-hidden': 'true',
    'fill': 'none',
    'height': '12',
    'stroke': 'currentColor',
    'stroke-width': '1.3',
    'viewBox': '0 0 14 14',
    'width': '12',
  },
  children: ['M4.4 4.4V1.6h8v8H9.6', 'M1.6 4.4h8v8h-8z'].map(d => ({
    type: 'element',
    tagName: 'path',
    properties: {d},
    children: [],
  })),
};

/* Wraps each highlighted <pre> in the listing frame. */
export const codeFrame = {
  name: 'code-frame',
  root(root) {
    const label = languageLabel(this.options.lang);
    const pre = root.children.find(node => node.tagName === 'pre');

    if (!pre) {
      return;
    }

    root.children = [{
      type: 'element',
      tagName: 'div',
      properties: {className: ['codeWrapper'], dataLanguage: label},
      children: [
        {
          type: 'element',
          tagName: 'div',
          properties: {className: ['codeHeader']},
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: {className: ['codeLanguage']},
              children: [{type: 'text', value: label}],
            },
            {
              type: 'element',
              tagName: 'button',
              properties: {className: ['codeCopyButton'], type: 'button'},
              children: [copyIcon, {type: 'text', value: 'Copy'}],
            },
          ],
        },
        pre,
      ],
    }];
  },
};
