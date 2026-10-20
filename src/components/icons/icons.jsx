import React from 'react';
import {ICONS, iconParts} from './icons.js';

/*
 * The icons.js set as React components, for the parts of the site that are
 * still React islands (search, the cheat sheet table).
 */
function makeIcon(name) {
  const Component = ({size, title}) => {
    const {attrs, body} = iconParts(ICONS[name], {size, title});

    // React wants camelCase for the hyphenated SVG attributes.
    const props = Object.fromEntries(Object.entries(attrs).map(
        ([key, value]) => [
          key.startsWith('aria-') ?
            key :
            key.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()),
          value,
        ],
    ));

    return (
      <svg {...props} dangerouslySetInnerHTML={{__html: body}} />
    );
  };

  Component.displayName = `${name}Icon`;
  return Component;
}

export const CategoryIcon = makeIcon('category');
export const ClockIcon = makeIcon('clock');
export const SearchIcon = makeIcon('search');
