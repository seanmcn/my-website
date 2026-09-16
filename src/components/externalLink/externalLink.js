import React, {useState} from 'react';

const SITE_HOSTNAME = 'seanmcn.com';

function getExternalHostname(href) {
  if (!href) {
    return null;
  }

  let url;
  try {
    url = new URL(href, `https://${SITE_HOSTNAME}`);
  } catch {
    return null;
  }

  if (!/^https?:$/.test(url.protocol)) {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, '');
  return hostname === SITE_HOSTNAME ? null : hostname;
}

// MDX `a` override. Internal links pass straight through; external links get
// a lazy-loaded favicon fetched at build time by scripts/fetch-favicons.mjs
// (never at request time, so no per-visitor third-party call). A domain the
// script hasn't seen yet just has no icon file, and the <img> quietly hides
// itself on 404 rather than showing a broken-image glyph.
export function ExternalLink({href, children, ...rest}) {
  const [iconFailed, setIconFailed] = useState(false);
  const hostname = getExternalHostname(href);

  if (!hostname) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <a href={href} {...rest}>{children}</a>;
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <a href={href} {...rest} className="externalLink">
      {!iconFailed && (
        <img
          alt=""
          className="externalLink__icon"
          height="16"
          loading="lazy"
          src={`/favicons/${hostname}.png`}
          width="16"
          onError={() => setIconFailed(true)}
        />
      )}
      {children}
    </a>
  );
}

export default ExternalLink;
