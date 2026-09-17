import {
  wrapRootElement as wrap,
  wrapPageElement as wrapPage,
} from './wrap-root-element';

export const wrapRootElement = wrap;
export const wrapPageElement = wrapPage;

function syncDocumentTitle() {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.title && document.title.trim()) {
    return;
  }

  const titleMeta = document.querySelector(
      'meta[property="og:title"], meta[name="twitter:title"]',
  );

  if (titleMeta?.content) {
    document.title = titleMeta.content;
  }
}

export const onInitialClientRender = () => {
  syncDocumentTitle();
};

export const onRouteUpdate = () => {
  syncDocumentTitle();
};
