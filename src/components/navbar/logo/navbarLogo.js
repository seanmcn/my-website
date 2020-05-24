import React from 'react'
import { Link } from 'gatsby'
import emoji from '../../../assets/images/emoji.png'
import './navbarLogo.scss'

const NavbarLogo = () => {
  return (
    <Link to="/" className="navbar-item" aria-label="Homepage">
      <img src={emoji} alt="Sean McNamara" className="emjoiLogo" />
      <h1 className="logoText">Sean McNamara</h1>
    </Link>
  )
}

export default NavbarLogo
