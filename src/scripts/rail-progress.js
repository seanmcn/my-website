/*
 * Moves a sticky rail that's taller than the viewport in step with reading
 * progress (see .item-rail): top-aligned at the start of the page,
 * bottom-aligned by the end of its container, a slow slide in between.
 * Sets two custom properties for the CSS to do the geometry with:
 *
 * --rail-h         the rail's own height, which CSS can't read itself. It
 *                  changes with content, window width and the fluid root
 *                  font size, so a ResizeObserver keeps it current.
 * --rail-progress  0 at the top of the page, 1 once the container's bottom
 *                  reaches the bottom of the viewport.
 */
export function followReadingProgress(selector) {
  const rail = document.querySelector(selector);

  if (!rail) {
    return;
  }

  const container = rail.parentElement;

  const onScroll = () => {
    const range = window.scrollY + container.getBoundingClientRect().bottom -
      window.innerHeight;
    const progress = range > 0 ?
      Math.min(1, Math.max(0, window.scrollY / range)) : 0;

    rail.style.setProperty('--rail-progress', progress.toFixed(4));
  };

  new ResizeObserver(([entry]) => {
    rail.style.setProperty(
        '--rail-h',
        `${entry.borderBoxSize[0].blockSize}px`,
    );
    onScroll();
  }).observe(rail);

  onScroll();
  window.addEventListener('scroll', onScroll, {passive: true});
  window.addEventListener('resize', onScroll, {passive: true});
}
