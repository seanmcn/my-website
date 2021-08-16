import React from 'react';
import { Link } from 'gatsby';
import './navbarLogo.scss';
import logoBeer from '../../../assets/images/emojis/75/beer.png';
import logoCheer from '../../../assets/images/emojis/75/cheer.png';
import logoThumbsUp from '../../../assets/images/emojis/75/thumbs-up.png';

const NavbarLogo = () => {
  const map = [logoBeer, logoCheer, logoThumbsUp];
  const randomMapKey = Math.floor(Math.random() * 3);
  const emoji = map[randomMapKey];
  return (
    <Link to="/" className="navbar-item" aria-label="Homepage">
      <img src={emoji} alt="Emoji of Sean (varies between dressed as santa, thumbs up, cheering and having a beer)" className="emjoiLogo" />
      <h1 className="logoText">Sean McNamara</h1>
    </Link>
  );
};

export default NavbarLogo;
