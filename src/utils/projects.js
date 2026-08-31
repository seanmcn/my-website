/*
 * Each language gets one of the palette's accent colours, reused for the dot
 * in the stack filter, the badge on a row, and the spine on a card so a stack
 * is recognisable before the label is read.
 */
const STACK_COLOURS = {
  Go: 'var(--accent)',
  Swift: 'var(--amber)',
  TypeScript: 'var(--blue)',
  JavaScript: 'var(--blue)',
  React: 'var(--plum)',
  Python: 'var(--faint)',
};

export function stackColour(language) {
  return STACK_COLOURS[language] || 'var(--faint)';
}

export default stackColour;
