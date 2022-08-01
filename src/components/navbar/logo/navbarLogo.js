import React from 'react';
import {Link} from 'gatsby';
import './navbarLogo.scss';
import logoBeer from '../../../assets/images/emojis/75/beer.png';
import logoCheer from '../../../assets/images/emojis/75/cheer.png';
import logoThumbsUp from '../../../assets/images/emojis/75/thumbs-up.png';
import logoSanta from '../../../assets/images/emojis/75/santa.png';

const NavbarLogo = () => {
  const map = [logoBeer, logoCheer, logoThumbsUp];
  const randomMapKey = Math.floor(Math.random() * 3);
  let emoji = map[randomMapKey];

  // If it's December, just display the Santa emoji.
  const d = new Date();
  if (d.getMonth() === 11) {
    emoji = logoSanta;
  }
  return (
    <Link to="/" className="navbar-item" aria-label="Homepage">
      <img src={emoji}
        alt="Emoji of Sean (varies between santa, thumbs up, cheering)"
        className="emjoiLogo"/>
      <h1 className="logoText">Sean McNamara</h1>
    </Link>
  );
};

export default NavbarLogo;
