import {useEffect} from 'react';
import PropTypes from 'prop-types';

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

const RuntimeSeoSync = ({
  title,
  description,
  pathname,
  siteUrl,
}) => {
  useEffect(() => {
    document.title = title;

    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    });

    if (description) {
      upsertMeta('meta[name="description"]', {
        name: 'description',
        content: description,
      });
      upsertMeta('meta[property="og:description"]', {
        property: 'og:description',
        content: description,
      });
      upsertMeta('meta[name="twitter:description"]', {
        name: 'twitter:description',
        content: description,
      });
    }

    if (siteUrl && pathname) {
      upsertCanonical(new URL(pathname, siteUrl).toString());
    }
  }, [description, pathname, siteUrl, title]);

  return null;
};

RuntimeSeoSync.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  pathname: PropTypes.string,
  siteUrl: PropTypes.string,
};

RuntimeSeoSync.defaultProps = {
  description: '',
  pathname: '/',
  siteUrl: '',
};

export default RuntimeSeoSync;
