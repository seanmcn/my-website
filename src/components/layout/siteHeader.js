import React from 'react';
import {Link, navigate} from 'gatsby';
import {useLocation} from '@gatsbyjs/reach-router';
import ThemeToggle from '../theme/themeToggle';
import MobileMenu from './mobileMenu';
import avatar from '../../assets/images/emojis/250/wave.png';

const NAV_LINKS = [
  {label: 'Index', to: '/', match: pathname => pathname === '/'},
  {
    label: 'Library',
    to: '/library/',
    match: pathname => pathname.startsWith('/library'),
  },
  {
    label: 'Projects',
    to: '/projects/',
    match: pathname => pathname.startsWith('/projects'),
  },
  {
    label: 'About',
    to: '/about/',
    match: pathname => pathname.startsWith('/about'),
  },
  {
    label: 'Contact',
    to: '/contact/',
    match: pathname => pathname.startsWith('/contact'),
  },
];

const SiteHeader = () => {
  const {pathname} = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isSearch = pathname.startsWith('/search');

  const closeMenu = React.useCallback(() => setMenuOpen(false), []);

  React.useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

  React.useEffect(() => {
    document.documentElement.classList.toggle('no-html-scroll', menuOpen);

    return () => document.documentElement.classList.remove('no-html-scroll');
  }, [menuOpen]);

  // "/" anywhere, or Cmd/Ctrl-K, opens search — the shortcut the header
  // advertises next to the search button.
  React.useEffect(() => {
    const onKeyDown = (event) => {
      const tag = (event.target?.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' ||
        event.target?.isContentEditable;

      if (event.key === 'Escape' && isSearch) {
        navigate(-1);
        return;
      }

      if (typing) {
        return;
      }

      if (event.key === '/' ||
        (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey))) {
        event.preventDefault();
        navigate('/search/');
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearch]);

  return (
    <>
      <header className="siteHeader">
        <div className="siteHeader__inner shell">
          <Link className="siteHeader__logo" to="/">
            <span className="siteHeader__avatar">
              <img src={avatar} alt="" width="34" height="34" />
            </span>
            <span>
              <span className="siteHeader__wordmark">Seán McNamara</span>
              <span className="siteHeader__tagline">
                Software engineering &amp; other rabbit holes
              </span>
            </span>
          </Link>

          <nav className="siteHeader__nav" aria-label="Primary">
            {NAV_LINKS.map(link => (
              <Link
                className={`siteHeader__navLink ${
                  link.match(pathname) ? 'is-active' : ''
                }`}
                key={link.to}
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="siteHeader__burger"
            onClick={() => setMenuOpen(open => !open)}
            type="button"
          >
            ☰
          </button>

          <ThemeToggle />

          {isSearch ? (
            <button
              className="siteHeader__searchClose"
              onClick={() => navigate(-1)}
              type="button"
            >
              <span>Close</span>
              <span aria-hidden="true" className="siteHeader__closeGlyph">
                ✕
              </span>
              <span className="siteHeader__shortcut">Esc</span>
            </button>
          ) : (
            <Link className="siteHeader__search" to="/search/">
              <span aria-hidden="true" className="siteHeader__searchGlyph">
                ⌕
              </span>
              <span className="siteHeader__searchLabel">Search</span>
              <span aria-hidden="true" className="siteHeader__shortcut">/</span>
            </Link>
          )}
        </div>
      </header>

      <MobileMenu
        links={NAV_LINKS}
        onClose={closeMenu}
        open={menuOpen}
        pathname={pathname}
      />
    </>
  );
};

SiteHeader.propTypes = {};

export default SiteHeader;
