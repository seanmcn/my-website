import React from 'react';
import { Link } from 'gatsby';
import './navbarLogo.scss';
import logo from '../../../assets/images/emojis/75/beer.png';

const NavbarLogo = () => (
  <Link to="/" className="navbar-item" aria-label="Homepage">
    <img src={logo} alt="Emoji of Sean (varies between dressed as santa, thumbs up, cheering and having a beer)" className="emjoiLogo" />
    <h1 className="logoText">Sean McNamara</h1>
  </Link>
);

export default NavbarLogo;
