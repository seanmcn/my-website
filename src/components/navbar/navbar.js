import React from 'react'
import NavbarItem from './item/navbarItem'
import NavbarBurger from './burger/navbarBurger'
import NavbarItemSocial from './itemSocial/navbarItemSocial'
import NavbarLogo from './logo/navbarLogo'
import './navbar.scss'

export default class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeMenu: false,
    }
  }

  toggleMenu = () => {
    const { activeMenu } = this.state
    this.setState({
      activeMenu: !activeMenu,
    })
  }

  render() {
    const { activeMenu } = this.state
    return (
      <nav
        className="navbar is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavbarLogo />

            <NavbarBurger active={activeMenu} toggleMenu={this.toggleMenu} />
          </div>

          <div className={`navbar-menu ${activeMenu ? 'is-active' : ''}`}>
            <div className="navbar-start">
              <NavbarItem link="/" label="Home" />
              <NavbarItem link="/blog" label="Blog" />
              <NavbarItem link="/about" label="About Me" />
              <NavbarItem link="/contact" label="Contact" />
            </div>

            <div className="navbar-end navbar-social-icons">
              <NavbarItemSocial
                link="https://www.linkedin.com/in/mrseanmcn"
                label="LinkedIn Profile"
                icon="fa-linkedin"
              />
              <NavbarItemSocial
                link="https://github.com/seanmcn"
                label="Github Profile"
                icon="fa-github-alt"
              />
              <NavbarItemSocial
                link="https://www.goodreads.com/seanmcn"
                label="Goodreads Profile"
                icon="fa-goodreads"
              />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}
