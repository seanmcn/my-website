import React from 'react';
import PropTypes from 'prop-types';
import Icon from './icons';

/*
 * Glyphs for the modifier and special keys used in shortcut tables. Drawn on
 * the same 14x14 grid as the rest of icons.js so they sit at the same
 * optical weight as the keycap text beside them.
 */
const GLYPHS = {
  cmd: (
    <>
      <rect x="5" y="0.3" width="4" height="4" rx="1.1" />
      <rect x="5" y="9.7" width="4" height="4" rx="1.1" />
      <rect x="0.3" y="5" width="4" height="4" rx="1.1" />
      <rect x="9.7" y="5" width="4" height="4" rx="1.1" />
      <path d="M7 4.3V9.7M4.3 7H9.7" />
    </>
  ),
  option: <path d="M2 11H6L11.3 3H12.7" />,
  control: <path d="M2.4 8.6 7 4 11.6 8.6" />,
  tab: (
    <>
      <path d="M1.2 7H8M5.3 4.2 8 7 5.3 9.8" />
      <path d="M12 2.4V11.6" />
    </>
  ),
  return: <path d="M10.6 3V8H3.6M6.4 5.2 3.4 8 6.4 10.8" />,
  win: (
    <>
      <rect x="1" y="1" width="5" height="5" rx="0.8" />
      <rect x="8" y="1" width="5" height="5" rx="0.8" />
      <rect x="1" y="8" width="5" height="5" rx="0.8" />
      <rect x="8" y="8" width="5" height="5" rx="0.8" />
    </>
  ),
};

const UP_ARROW = (
  <path d="M7 1.4 12 7.4H9V12.6H5V7.4H2Z" strokeLinejoin="round" />
);

// Shift and the arrow keys all read as the same up-pointing glyph, just
// aimed a different way, so they share one path rotated per direction.
const ARROW_ROTATIONS = {up: 0, shift: 0, right: 90, down: 180, left: 270};

// Passed to Icon as `title`, which gives the svg an accessible name (via
// role="img") and, being a native <title>, a hover tooltip for free.
const LABELS = {
  cmd: 'Command key',
  option: 'Option key',
  control: 'Control key',
  tab: 'Tab key',
  return: 'Return key',
  win: 'Windows key',
  shift: 'Shift key',
  up: 'Up arrow key',
  down: 'Down arrow key',
  left: 'Left arrow key',
  right: 'Right arrow key',
};

const Key = ({name, ...rest}) => {
  if (name in ARROW_ROTATIONS) {
    const degrees = ARROW_ROTATIONS[name];
    return (
      <Icon
        strokeLinecap="round"
        strokeLinejoin="round"
        title={LABELS[name]}
        {...rest}
      >
        <g transform={degrees ? `rotate(${degrees} 7 7)` : undefined}>
          {UP_ARROW}
        </g>
      </Icon>
    );
  }

  const glyph = GLYPHS[name];
  if (!glyph) {
    return null;
  }

  return (
    <Icon
      strokeLinecap="round"
      strokeLinejoin="round"
      title={LABELS[name]}
      {...rest}
    >
      {glyph}
    </Icon>
  );
};

Key.propTypes = {
  name: PropTypes.oneOf([
    ...Object.keys(GLYPHS),
    ...Object.keys(ARROW_ROTATIONS),
  ]).isRequired,
};

export default Key;
