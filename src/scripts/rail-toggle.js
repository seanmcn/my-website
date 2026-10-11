/*
 * The "Filters ▾" button that opens a collapsible rail on narrow screens,
 * shared by the library screens and search.
 */
export function bindRailToggle() {
  const toggle = document.querySelector('.rail-toggle');
  const rail = document.querySelector('.rail--collapsible');

  if (!toggle || !rail) {
    return;
  }

  toggle.addEventListener('click', () => {
    const open = !rail.classList.contains('is-open');
    rail.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Hide filters ✕' : 'Filters ▾';
  });
}
