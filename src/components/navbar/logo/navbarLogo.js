import React from 'react';
import { Link } from 'gatsby';
// import emoji from '../../../assets/images/emojis/75/beer.png'
import './navbarLogo.scss';

const NavbarLogo = () => {
  // eslint-disable-next-line global-require
  const map = ['beer.png', 'cheer.png', 'thumbs-up.png', 'wave.png'];
  const randomMapKey = Math.floor(Math.random() * 4);
  // eslint-disable-next-line global-require,import/no-dynamic-require
  const emoji = require(`../../../assets/images/emojis/75/${map[randomMapKey]}`);

  return (
    <Link to="/" className="navbar-item" aria-label="Homepage">
      <img src={emoji} alt="Sean McNamara" className="emjoiLogo" />
      <h1 className="logoText">Sean McNamara</h1>
    </Link>
  );
};

export default NavbarLogo;
