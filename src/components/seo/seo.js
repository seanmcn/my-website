import React from 'react';

function normaliseDescription(description, fallback = '') {
  return (description || fallback || '')
      .replace(/\s+/g, ' ')
      .trim();
}

function buildCanonicalUrl(siteUrl, pathname = '/') {
  return new URL(pathname || '/', siteUrl).toString();
}

const SEO = ({
  title,
  description,
  siteTitle,
  siteDescription,
  siteUrl,
  pathname,
  type = 'website',
  noIndex = false,
}) => {
  const resolvedDescription = normaliseDescription(description, siteDescription);
  const canonicalUrl = buildCanonicalUrl(siteUrl, pathname);

  return (
    <>
      <title>{title}</title>
      {resolvedDescription && (
        <meta name="description" content={resolvedDescription} />
      )}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {resolvedDescription && (
        <meta property="og:description" content={resolvedDescription} />
      )}
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      {resolvedDescription && (
        <meta name="twitter:description" content={resolvedDescription} />
      )}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
};

export default SEO;
