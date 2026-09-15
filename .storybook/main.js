/*
 * Local, dev-only reference for the MDX components available to blog posts
 * (Kbd, Steps, Note, StickyNote/StickyStack/StickyRef, Code). Not part of
 * the Gatsby build - a separate dev server (`npm run storybook`) that never
 * ships.
 */

/** @type {import('@storybook/react-webpack5').StorybookConfig} */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  webpackFinal: async (webpackConfig) => {
    webpackConfig.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    });
    return webpackConfig;
  },
};

export default config;
