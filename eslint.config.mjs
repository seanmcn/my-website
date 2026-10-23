import {builtinRules} from 'eslint/use-at-your-own-risk';
import google from 'eslint-config-google';
import globals from 'globals';

const FILES = ['**/*.{js,mjs}'];

// eslint-config-google predates ESLint 9 and still sets rules ESLint has
// since removed (valid-jsdoc, require-jsdoc); keep only the ones that exist.
const googleRules = Object.fromEntries(
    Object.entries(google.rules).filter(([rule]) => builtinRules.has(rule)),
);

export default [
  {ignores: ['dist/', '.astro/', 'content/', 'infra/cdk.out/']},
  {
    files: FILES,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      ...googleRules,
      'arrow-parens': ['error', 'as-needed', {requireForBlockBody: true}],
    },
  },
  {
    files: ['scripts/**/*.{js,mjs}', 'infra/**/*.{js,mjs}'],
    languageOptions: {globals: globals.node},
    rules: {
      'max-len': ['error', {
        code: 80,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
      }],
    },
  },
];
