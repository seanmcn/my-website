import { wrapRootElement as wrap } from './wrap-root-element';

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = wrap;

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
