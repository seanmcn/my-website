/*
 * The mobile menu and the search shortcut, which SiteHeader and MobileMenu
 * did with React state. The menu is server-rendered and hidden, so this only
 * toggles it.
 */
const menu = document.querySelector('.mobile-menu');
const burger = document.querySelector('.site-header__burger');

function setMenu(open) {
  menu.hidden = !open;
  burger.setAttribute('aria-expanded', String(open));
  document.documentElement.classList.toggle('no-html-scroll', open);
  if (open) {
    menu.querySelector('.mobile-menu__close').focus();
  }
}

burger.addEventListener('click', () => setMenu(menu.hidden));
menu.querySelector('.mobile-menu__close')
    .addEventListener('click', () => setMenu(false));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !menu.hidden) {
    setMenu(false);
    return;
  }

  const tag = (event.target?.tagName || '').toLowerCase();
  const typing = tag === 'input' || tag === 'textarea' ||
    event.target?.isContentEditable;

  if (typing) {
    return;
  }

  // "/" anywhere, or Cmd/Ctrl-K, opens search.
  if (event.key === '/' ||
    (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))) {
    event.preventDefault();
    window.location.assign('/search/');
  }
});
