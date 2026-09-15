import React from 'react';
import PropTypes from 'prop-types';
import Key from '../icons/keycapKey';

// Key names that have a glyph in keycapKey.js. Anything else is rendered as
// a literal keycap, e.g. Space, Del, 4, `.
const KEY_NAMES = new Set([
  'cmd', 'option', 'control', 'tab', 'return', 'win',
  'shift', 'up', 'down', 'left', 'right',
]);

function renderToken(token) {
  return KEY_NAMES.has(token.toLowerCase()) ?
    <Key name={token.toLowerCase()} /> :
    token;
}

/*
 * A shortcut written as plain text, e.g. `cmd-shift-.` or `control-left/right`
 * for alternates. Hyphens separate keys (rendered as +, matching how the
 * keys are actually pressed) and slashes separate alternates (rendered as
 * /). Anything not in KEY_NAMES falls through as a literal keycap.
 */
export const Kbd = ({children}) => {
  const chunks = String(children).split(/([-/])/);

  return (
    <span className="shortcut">
      {chunks.map((chunk, i) => {
        if (i % 2 === 1) {
          const sep = chunk === '-' ? '+' : '/';
          // eslint-disable-next-line react/no-array-index-key
          return <span className="keySep" key={i}>{sep}</span>;
        }
        // eslint-disable-next-line react/no-array-index-key
        return <code key={i}>{renderToken(chunk)}</code>;
      })}
    </span>
  );
};

Kbd.propTypes = {
  children: PropTypes.node.isRequired,
};
