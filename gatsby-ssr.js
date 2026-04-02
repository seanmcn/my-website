import React from 'react';
import {wrapRootElement as wrap} from './wrap-root-element';

export const wrapRootElement = wrap;

const themeBootScript = `
  (function() {
    var storageKey = 'site-theme-preference';
    var systemPreference = 'system';
    var root = document.documentElement;
    var storedPreference = null;

    try {
      storedPreference = window.localStorage.getItem(storageKey);
    } catch (error) {}

    if (storedPreference !== 'light' &&
        storedPreference !== 'dark' &&
        storedPreference !== systemPreference) {
      storedPreference = null;
    }

    var themePreference = storedPreference || systemPreference;
    var isDarkMode = false;

    if (themePreference === systemPreference &&
        typeof window.matchMedia === 'function') {
      isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDarkMode = themePreference === 'dark';
    }

    var resolvedTheme = isDarkMode ? 'dark' : 'light';
    root.dataset.themePreference = themePreference;
    root.dataset.theme = resolvedTheme;
    root.dataset.themePersisted = storedPreference ? 'true' : 'false';
    root.style.colorScheme = resolvedTheme;
  })();
`;

export const onRenderBody = ({setHeadComponents, setHtmlAttributes}) => {
  setHtmlAttributes({lang: 'en'});
  setHeadComponents([
    <script
      key="theme-boot-script"
      dangerouslySetInnerHTML={{__html: themeBootScript}}
    />,
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
