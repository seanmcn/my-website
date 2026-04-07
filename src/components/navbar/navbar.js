import React from 'react';
import {useLocation} from '@gatsbyjs/reach-router';
import NavbarItem from './item/navbarItem';
import NavbarBurger from './burger/navbarBurger';
import NavbarItemSocial from './itemSocial/navbarItemSocial';
import NavbarLogo from './logo/navbarLogo';
import Search from '../search/search';
import SearchButton from '../search/searchButton';
import ThemeSelector from '../theme/themeSelector';
import CategoriesWidget from '../widgets/categories/categoriesWidget';
import TagsWidget from '../widgets/tags/tagsWidget';
import './navbar.scss';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const BLOG_ROUTE_PATTERN = /^\/blog(?:\/|$)/;

const Navbar = () => {
  const [activeMenu, setActiveMenu] = React.useState(false);
  const pendingSearchOpenFrameRef = React.useRef(null);
  const searchOpenHandlerRef = React.useRef(null);
  const activeMenuRef = React.useRef(activeMenu);
  const {pathname} = useLocation();
  const showBlogBrowseInMobileMenu = BLOG_ROUTE_PATTERN.test(pathname);

  const closeMenu = React.useCallback(() => {
    setActiveMenu(false);
  }, []);

  const toggleMenu = React.useCallback(() => {
    setActiveMenu(currentMenuState => !currentMenuState);
  }, []);

  React.useEffect(() => {
    closeMenu();
  }, [closeMenu, pathname]);

  React.useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  React.useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const className = 'no-html-scroll';
    document.documentElement.classList.toggle(className, activeMenu);

    return () => {
      document.documentElement.classList.remove(className);
    };
  }, [activeMenu]);

  React.useEffect(() => {
    if (!activeMenu || typeof document === 'undefined') {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeMenu, closeMenu]);

  React.useEffect(() => () => {
    if (pendingSearchOpenFrameRef.current && typeof window !== 'undefined') {
      window.cancelAnimationFrame(pendingSearchOpenFrameRef.current);
    }
  }, []);

  const registerOpenHandler = React.useCallback((handlerFactory) => {
    searchOpenHandlerRef.current = handlerFactory ? handlerFactory() : null;
  }, []);

  const openSearch = React.useCallback(() => {
    if (!searchOpenHandlerRef.current) {
      return;
    }

    if (pendingSearchOpenFrameRef.current && typeof window !== 'undefined') {
      window.cancelAnimationFrame(pendingSearchOpenFrameRef.current);
      pendingSearchOpenFrameRef.current = null;
    }

    if (activeMenuRef.current) {
      closeMenu();
      pendingSearchOpenFrameRef.current = window.requestAnimationFrame(() => {
        pendingSearchOpenFrameRef.current = null;
        searchOpenHandlerRef.current?.();
      });
      return;
    }

    searchOpenHandlerRef.current();
  }, [closeMenu]);

  return (
    <nav className="navbar siteNavbar" aria-label="Primary">
      <div className="container siteNavbarContainer">
        <div className="navbar-brand">
          <NavbarLogo/>
          <NavbarBurger active={activeMenu} toggleMenu={toggleMenu}/>
        </div>
        <div
          className="navbar-menu siteNavbarMenu"
          role="navigation"
          aria-label="navigation"
        >
          <div className="navbar-start siteNavbarLinks">
            <NavbarItem link="/" label="Home"/>
            <NavbarItem link="/blog" label="Blog"/>
            <NavbarItem link="/about" label="About Me"/>
            <NavbarItem link="/contact" label="Contact Me"/>
          </div>

          <div className="navbar-end siteNavbarActions">
            <ThemeSelector/>
            <div className="navbar-social-icons siteNavbarSocialGroup">
              <NavbarItemSocial
                link="https://www.linkedin.com/in/mrseanmcn"
                label="LinkedIn Profile"
              >
                <FontAwesomeIcon
                  icon={icon({name: 'linkedin', style: 'brands'})}
                  size={'lg'}/>
              </NavbarItemSocial>
              <NavbarItemSocial
                link="https://github.com/seanmcn"
                label="Github Profile"
              >
                <FontAwesomeIcon
                  icon={icon({name: 'github-alt', style: 'brands'})}
                  size={'lg'}/>
              </NavbarItemSocial>
              <NavbarItemSocial
                link="https://www.goodreads.com/seanmcn"
                label="Goodreads Profile"
              >
                <FontAwesomeIcon
                  icon={icon({name: 'goodreads', style: 'brands'})}
                  size={'lg'}/>
              </NavbarItemSocial>
            </div>
            <div className="siteNavbarSearch">
              <SearchButton openModal={openSearch}/>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`siteNavbarDrawerBackdrop ${activeMenu ? 'is-active' : ''}`}
        aria-hidden={!activeMenu}
        tabIndex={activeMenu ? 0 : -1}
        onClick={closeMenu}
      />

      <aside
        id="mobile-navigation-drawer"
        className={`siteNavbarDrawer ${activeMenu ? 'is-active' : ''}`}
        aria-hidden={!activeMenu}
        aria-label="Mobile navigation drawer"
      >
        <div className="siteNavbarDrawerHeader">
          <div>
            <p className="siteNavbarDrawerEyebrow">Navigation</p>
            <h2 className="siteNavbarDrawerTitle">Explore the site</h2>
          </div>
          <button
            type="button"
            className="siteNavbarDrawerClose"
            onClick={closeMenu}
            aria-label="Close navigation menu"
          >
            <span className="icon">
              <FontAwesomeIcon icon={icon({name: 'xmark'})} />
            </span>
          </button>
        </div>

        <div className="siteNavbarDrawerBody">
          <section
            className="siteNavbarDrawerSection"
            aria-labelledby="drawer-search"
          >
            <div className="siteNavbarDrawerSectionHeader">
              <h3 id="drawer-search" className="siteNavbarDrawerSectionTitle">
                Search
              </h3>
            </div>
            <div className="siteNavbarSearch siteNavbarSearch--drawer">
              <SearchButton openModal={openSearch}/>
            </div>
          </section>

          <section
            className="siteNavbarDrawerSection"
            aria-labelledby="drawer-main-nav"
          >
            <div className="siteNavbarDrawerSectionHeader">
              <h3 id="drawer-main-nav" className="siteNavbarDrawerSectionTitle">
                Main navigation
              </h3>
            </div>
            <div className="siteNavbarDrawerLinks">
              <NavbarItem link="/" label="Home" onClick={closeMenu}/>
              <NavbarItem link="/blog" label="Blog" onClick={closeMenu}/>
              <NavbarItem link="/about" label="About Me" onClick={closeMenu}/>
              <NavbarItem
                link="/contact"
                label="Contact Me"
                onClick={closeMenu}
              />
            </div>
          </section>

          <section
            className="siteNavbarDrawerSection"
            aria-labelledby="drawer-appearance"
          >
            <div className="siteNavbarDrawerSectionHeader">
              <h3
                id="drawer-appearance"
                className="siteNavbarDrawerSectionTitle"
              >
                Appearance
              </h3>
            </div>
            <div
              className="siteNavbarDrawerUtility
              siteNavbarDrawerUtility--theme"
            >
              <ThemeSelector/>
            </div>
          </section>

          <section
            className="siteNavbarDrawerSection"
            aria-labelledby="drawer-elsewhere"
          >
            <div className="siteNavbarDrawerSectionHeader">
              <h3
                id="drawer-elsewhere"
                className="siteNavbarDrawerSectionTitle"
              >
                Elsewhere
              </h3>
            </div>
            <div
              className="navbar-social-icons siteNavbarSocialGroup
              siteNavbarSocialGroup--drawer"
            >
              <NavbarItemSocial
                link="https://www.linkedin.com/in/mrseanmcn"
                label="LinkedIn Profile"
                onClick={closeMenu}
              >
                <FontAwesomeIcon
                  icon={icon({name: 'linkedin', style: 'brands'})}
                  size={'lg'}/>
              </NavbarItemSocial>
              <NavbarItemSocial
                link="https://github.com/seanmcn"
                label="Github Profile"
                onClick={closeMenu}
              >
                <FontAwesomeIcon
                  icon={icon({name: 'github-alt', style: 'brands'})}
                  size={'lg'}/>
              </NavbarItemSocial>
              <NavbarItemSocial
                link="https://www.goodreads.com/seanmcn"
                label="Goodreads Profile"
                onClick={closeMenu}
              >
                <FontAwesomeIcon
                  icon={icon({name: 'goodreads', style: 'brands'})}
                  size={'lg'}/>
              </NavbarItemSocial>
            </div>
          </section>

          {showBlogBrowseInMobileMenu && (
            <section
              className="siteNavbarDrawerSection"
              aria-labelledby="drawer-browse-blog"
            >
              <div className="siteNavbarDrawerSectionHeader">
                <h3
                  id="drawer-browse-blog"
                  className="siteNavbarDrawerSectionTitle"
                >
                  Browse blog
                </h3>
              </div>
              <div className="siteNavbarDrawerBrowse">
                <CategoriesWidget
                  variant="drawer"
                  onLinkClick={closeMenu}
                />
                <TagsWidget
                  variant="drawer"
                  onLinkClick={closeMenu}
                />
              </div>
            </section>
          )}

        </div>
      </aside>
      <Search
        registerOpenHandler={registerOpenHandler}
        hideButton
      />
    </nav>
  );
};

export default Navbar;
