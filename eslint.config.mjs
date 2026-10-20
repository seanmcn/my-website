import {builtinRules} from 'eslint/use-at-your-own-risk';
import google from 'eslint-config-google';
import react from 'eslint-plugin-react';
import globals from 'globals';

const FILES = ['**/*.{js,jsx,mjs}'];

// eslint-config-google predates ESLint 9 and still sets rules ESLint has
// since removed (valid-jsdoc, require-jsdoc); keep only the ones that exist.
const googleRules = Object.fromEntries(
    Object.entries(google.rules).filter(([rule]) => builtinRules.has(rule)),
);

export default [
  {ignores: ['dist/', '.astro/', 'content/']},
  {files: FILES, ...react.configs.flat.recommended},
  {
    files: FILES,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {ecmaFeatures: {jsx: true}},
      globals: globals.browser,
    },
    settings: {react: {version: 'detect'}},
    rules: {
      ...googleRules,
      'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx']}],
      'react/prefer-stateless-function': 'off',
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'react/no-danger': 'off',
      'arrow-parens': ['error', 'as-needed', {requireForBlockBody: true}],
    },
  },
  {
    files: ['scripts/**/*.{js,mjs}'],
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
