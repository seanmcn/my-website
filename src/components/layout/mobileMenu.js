import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {useTheme} from '../theme/theme';

/*
 * Full-screen navigation for narrow viewports. The header hides its nav below
 * 760px and hands over to this, which also carries the search and theme
 * controls the header drops at that width.
 */
const MobileMenu = ({links, onClose, open, pathname}) => {
  const {resolvedTheme, setThemePreference} = useTheme();
  const closeButtonRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) {
      return undefined;
    }

    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <div className="mobileMenu" role="dialog" aria-label="Menu">
      <div className="mobileMenu__head">
        <span className="mobileMenu__eyebrow">Menu</span>
        <button
          aria-label="Close menu"
          className="mobileMenu__close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          ✕
        </button>
      </div>

      <nav className="mobileMenu__nav">
        {links.map(link => (
          <Link
            className={`mobileMenu__link ${
              link.match(pathname) ? 'is-active' : ''
            }`}
            key={link.to}
            onClick={onClose}
            to={link.to}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="mobileMenu__actions">
        <Link className="mobileMenu__search" onClick={onClose} to="/search/">
          <span aria-hidden="true">⌕</span>
          Search
        </Link>
        <button
          className="mobileMenu__theme"
          onClick={() => setThemePreference(nextTheme)}
          type="button"
        >
          <span aria-hidden="true">
            {resolvedTheme === 'dark' ? '☀︎' : '◐'}
          </span>
          {resolvedTheme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  );
};

MobileMenu.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    match: PropTypes.func.isRequired,
    to: PropTypes.string.isRequired,
  })).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  pathname: PropTypes.string,
};

MobileMenu.defaultProps = {
  open: false,
  pathname: '/',
};

export default MobileMenu;
