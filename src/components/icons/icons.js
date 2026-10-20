/*
 * The site's icon set, drawn on one 14x14 grid so every glyph sits at the same
 * optical weight as the text beside it. Kept as plain data so the same icons
 * render from Astro (Icon.astro) and from browser scripts (iconSvg below).
 *
 * Each entry is the SVG's inner markup plus any attributes that differ from
 * the defaults (stroked, 1.2 wide, no fill).
 */
export const ICONS = {
  category: {body: '<path d="M1 3.2h4l1.3 1.6H13v7.2H1z"/>'},
  calendar: {
    body: '<rect x="1.6" y="3" width="10.8" height="9.4"/>' +
      '<path d="M1.6 5.9h10.8M4.4 1.4v2.4M9.6 1.4v2.4"/>',
  },
  clock: {body: '<circle cx="7" cy="7" r="5.4"/><path d="M7 4.2V7l2 1.4"/>'},
  tag: {
    attrs: {'stroke-linejoin': 'round'},
    body: '<path d="M7.4 1.2H12.8V6.6L6.6 12.8 1.2 7.4z"/>' +
      '<circle cx="10" cy="4" r="1"/>',
  },
  arrowLeft: {
    attrs: {'stroke-width': '1.4'},
    body: '<path d="M6 2.5 1.5 7 6 11.5"/><path d="M1.8 7H12.5"/>',
  },
  reply: {body: '<path d="M1.4 3.2h11.2v6.6H6.4L3.4 12V9.8H1.4z"/>'},
  copy: {
    attrs: {'stroke-width': '1.3'},
    body: '<path d="M4.4 4.4V1.6h8v8H9.6"/><path d="M1.6 4.4h8v8h-8z"/>',
  },
  search: {
    attrs: {'stroke-width': '1.4'},
    body: '<circle cx="6.2" cy="6.2" r="4.4"/><path d="M9.5 9.5 12.6 12.6"/>',
  },
  // The diagram viewer's controls.
  expand: {
    attrs: {'stroke-width': '1.4'},
    body: '<path d="M1.6 5V1.6H5M9 1.6h3.4V5M12.4 9v3.4H9M5 12.4H1.6V9"/>',
  },
  minus: {attrs: {'stroke-width': '1.4'}, body: '<path d="M2.6 7h8.8"/>'},
  plus: {
    attrs: {'stroke-width': '1.4'},
    body: '<path d="M2.6 7h8.8M7 2.6v8.8"/>',
  },
  rotate: {
    attrs: {
      'stroke-width': '1.4',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    },
    body: '<path d="M12.2 7.4A5.2 5.2 0 1 1 10.4 3"/>' +
      '<path d="M10.8 0.9v2.5H8.3"/>',
  },
  close: {
    attrs: {'stroke-width': '1.4'},
    body: '<path d="M2.8 2.8l8.4 8.4M11.2 2.8l-8.4 8.4"/>',
  },
  // Profiles. LinkedIn's "in" is drawn to the grid; GitHub's mark is the
  // Simple Icons path (CC0) on its own 24 grid, filled, since a stroked
  // Octocat stops reading as one.
  linkedin: {
    attrs: {'stroke-width': '1.8'},
    body: '<circle cx="2.5" cy="2.3" r="1.1" fill="currentColor" ' +
      'stroke="none"/><path d="M2.5 5.2v7.6M6 12.8V5.2M6 8.2c0-1.9 1.3-3.1 ' +
      '3-3.1s2.9 1.1 2.9 3.3v4.4"/>',
  },
  github: {
    attrs: {'viewBox': '0 0 24 24', 'fill': 'currentColor', 'stroke': 'none'},
    body: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 ' +
      '11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-' +
      '4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744' +
      '.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 ' +
      '2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-' +
      '1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105' +
      '-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 ' +
      '2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873' +
      '.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92' +
      '.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69' +
      '.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>',
  },
};

/*
 * Keycap glyphs for the modifier and special keys in <Kbd> shortcuts. Each
 * carries a label, which becomes the svg's accessible name and, as a native
 * <title>, a hover tooltip.
 */
const UP_ARROW = '<path d="M7 1.4 12 7.4H9V12.6H5V7.4H2Z"/>';
const rotated = degrees =>
  `<g transform="rotate(${degrees} 7 7)">${UP_ARROW}</g>`;
const KEY_ATTRS = {'stroke-linecap': 'round', 'stroke-linejoin': 'round'};

export const KEYS = {
  cmd: {
    label: 'Command key',
    body: '<rect x="5" y="0.3" width="4" height="4" rx="1.1"/>' +
      '<rect x="5" y="9.7" width="4" height="4" rx="1.1"/>' +
      '<rect x="0.3" y="5" width="4" height="4" rx="1.1"/>' +
      '<rect x="9.7" y="5" width="4" height="4" rx="1.1"/>' +
      '<path d="M7 4.3V9.7M4.3 7H9.7"/>',
  },
  option: {label: 'Option key', body: '<path d="M2 11H6L11.3 3H12.7"/>'},
  control: {label: 'Control key', body: '<path d="M2.4 8.6 7 4 11.6 8.6"/>'},
  tab: {
    label: 'Tab key',
    body: '<path d="M1.2 7H8M5.3 4.2 8 7 5.3 9.8"/><path d="M12 2.4V11.6"/>',
  },
  return: {
    label: 'Return key',
    body: '<path d="M10.6 3V8H3.6M6.4 5.2 3.4 8 6.4 10.8"/>',
  },
  win: {
    label: 'Windows key',
    body: '<rect x="1" y="1" width="5" height="5" rx="0.8"/>' +
      '<rect x="8" y="1" width="5" height="5" rx="0.8"/>' +
      '<rect x="1" y="8" width="5" height="5" rx="0.8"/>' +
      '<rect x="8" y="8" width="5" height="5" rx="0.8"/>',
  },
  // Shift and the arrows are the same glyph aimed a different way.
  shift: {label: 'Shift key', body: UP_ARROW},
  up: {label: 'Up arrow key', body: UP_ARROW},
  right: {label: 'Right arrow key', body: rotated(90)},
  down: {label: 'Down arrow key', body: rotated(180)},
  left: {label: 'Left arrow key', body: rotated(270)},
};

Object.values(KEYS).forEach((key) => {
  key.attrs = KEY_ATTRS;
});

const escape = value => String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');

/*
 * The attributes and inner markup for an icon, for whichever renderer wants
 * them. `title` gives the svg an accessible name; without one it is hidden
 * from assistive tech, since it always sits beside a text label.
 */
export function iconParts(icon, {size = 12, title} = {}) {
  const attrs = {
    'fill': 'none',
    'stroke': 'currentColor',
    'stroke-width': '1.2',
    'viewBox': '0 0 14 14',
    'width': size,
    'height': size,
    ...icon.attrs,
    ...(title ? {role: 'img'} : {'aria-hidden': 'true'}),
  };
  const body = (title ? `<title>${escape(title)}</title>` : '') + icon.body;

  return {attrs, body};
}

/* An icon as an SVG string, for scripts that build DOM by hand. */
export function iconSvg(name, options) {
  const {attrs, body} = iconParts(ICONS[name], options);
  const attributes = Object.entries(attrs)
      .map(([key, value]) => `${key}="${escape(value)}"`)
      .join(' ');

  return `<svg ${attributes}>${body}</svg>`;
}
