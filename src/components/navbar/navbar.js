import React from 'react';
import NavbarItem from './item/navbarItem';
import NavbarBurger from './burger/navbarBurger';
import NavbarItemSocial from './itemSocial/navbarItemSocial';
import NavbarLogo from './logo/navbarLogo';
import Search from '../search/search';
import './navbar.scss';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMenu: false,
    };
  }

  toggleMenu = () => {
    const {activeMenu} = this.state;
    this.setState({
      activeMenu: !activeMenu,
    });
  };

  render() {
    const {activeMenu} = this.state;
    return (
      <nav className="navbar siteNavbar" aria-label="Primary">
        <div className="container siteNavbarContainer">
          <div className="navbar-brand">
            <NavbarLogo/>
            <NavbarBurger active={activeMenu} toggleMenu={this.toggleMenu}/>
          </div>
          <div
            className={
              `navbar-menu siteNavbarMenu ${activeMenu ? 'is-active' : ''}`
            }
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
                <Search toggleMenu={this.toggleMenu} activeMenu={activeMenu}/>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
