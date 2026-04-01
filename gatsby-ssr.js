import React from 'react';
import { wrapRootElement as wrap } from './wrap-root-element';

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = wrap;

export const onRenderBody = ({setHeadComponents, setHtmlAttributes}) => {
  setHtmlAttributes({lang: 'en'});
  setHeadComponents([
    <link
      key="fonts-preconnect"
      rel="preconnect"
      href="https://fonts.googleapis.com"
    />,
    <link
      key="fonts-preconnect-crossorigin"
      rel="preconnect"
      href="https://fonts.gstatic.com"
      crossOrigin="anonymous"
    />,
    <link
      key="fonts-stylesheet"
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600&display=swap"
    />,
    <meta
      key="viewport"
      name="viewport"
      content="width=device-width, initial-scale=1"
    />,
  ]);
};
