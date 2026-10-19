/*
 * Adds is-condensed to the given elements once the page has scrolled past the
 * header. Several pieces of chrome react to it: the sticky item bar shrinks
 * its title, and the about portrait pulls in so the rail keeps up.
 *
 * Condensing the sticky item bar shrinks the document, by 80px on a wide
 * screen where its title runs to two lines, and the scroll position then
 * moves by up to that much on its own: Chrome's scroll anchoring pulls it
 * back to hold the text still, and at the foot of a short page the browser
 * clamps it to the new end. If that move carries it back over the exit line,
 * the bar releases, grows, is pushed forward again and re-condenses, every
 * frame. So measure what condensing takes out of the page, enter only once
 * the page has scrolled past that plus the exit line, and leave near the top.
 * The gap between the two lines is then always wider than the move. A page
 * too short to reach the entry line never condenses.
 */
const RELEASE_OFFSET = 8;

export function condenseOnScroll(selector, threshold = 40) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    return;
  }

  const root = document.scrollingElement;
  let condensed = false;
  let enterOffset = threshold;

  const setCondensed = on => elements.forEach(element =>
    element.classList.toggle('is-condensed', on));

  // Both states are laid out with transitions off, so each reads at its end
  // size rather than the start of the animation towards it. Laying them out
  // can move the scroll position too (anchoring, or clamping at the foot of
  // the page), so put it back once the original state is restored.
  const measure = () => {
    const nodes = [...elements].flatMap(element =>
      [element, ...element.querySelectorAll('*')]);
    const scrollTop = root.scrollTop;

    nodes.forEach(node => node.style.transition = 'none');
    setCondensed(false);
    const fullHeight = root.scrollHeight;
    setCondensed(true);
    const shrink = fullHeight - root.scrollHeight;
    setCondensed(condensed);
    // Settle the restored layout before transitions return, or it animates.
    root.getBoundingClientRect();
    nodes.forEach(node => node.style.transition = '');
    root.scrollTop = scrollTop;

    enterOffset = Math.max(threshold, shrink + RELEASE_OFFSET);
  };

  const onScroll = () => {
    const offset = Math.max(window.scrollY, root.scrollTop);
    const next = condensed ?
      offset > RELEASE_OFFSET : offset > enterOffset;

    if (next !== condensed) {
      condensed = next;
      setCondensed(condensed);
    }
  };

  // The shrink depends on how the title wraps, so it changes with the width
  // and once the web fonts arrive.
  const remeasure = () => {
    measure();
    onScroll();
  };

  remeasure();
  document.fonts.ready.then(remeasure);
  window.addEventListener('resize', remeasure, {passive: true});
  window.addEventListener('scroll', onScroll, {passive: true});
}
