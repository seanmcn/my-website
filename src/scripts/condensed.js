/*
 * Adds is-condensed to the given elements once the page has scrolled past the
 * header. Several pieces of chrome react to it: the sticky item bar shrinks
 * its title, and the about portrait pulls in so the rail keeps up.
 *
 * Condensing shrinks the sticky bar's own box, which shrinks the document's
 * scroll height by the same amount. On a very short page that can pull the
 * scroll position back across the threshold, un-condense, grow the page and
 * re-trigger: a flicker loop. So measure the room to scroll before anything
 * condenses and never condense when it's too close to what the shrink takes,
 * and enter high but only leave near the top, so a shrink-induced wobble near
 * the entry point can't also cross the exit line.
 */
const MIN_SCROLLABLE_FOR_CONDENSE = 100;
const RELEASE_OFFSET = 8;

export function condenseOnScroll(selector, threshold = 40) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    return;
  }

  const baselineMaxScroll =
    document.scrollingElement.scrollHeight - window.innerHeight;
  let condensed = false;

  const onScroll = () => {
    const offset = Math.max(
        window.scrollY,
        document.scrollingElement.scrollTop,
    );
    const next = baselineMaxScroll < MIN_SCROLLABLE_FOR_CONDENSE ? false :
      condensed ? offset > RELEASE_OFFSET : offset > threshold;

    if (next !== condensed) {
      condensed = next;
      elements.forEach(element =>
        element.classList.toggle('is-condensed', condensed));
    }
  };

  onScroll();
  window.addEventListener('scroll', onScroll, {passive: true});
}
