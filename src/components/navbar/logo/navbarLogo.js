import React from 'react';
import {Link} from 'gatsby';
import './navbarLogo.scss';
import logoBeer from '../../../assets/images/emojis/75/beer.png';
import logoCheer from '../../../assets/images/emojis/75/cheer.png';
import logoThumbsUp from '../../../assets/images/emojis/75/thumbs-up.png';
import logoSanta from '../../../assets/images/emojis/75/santa.png';

const NavbarLogo = () => {
  // Use a stable default during SSR/hydration to avoid markup mismatch
  // (React error #423). The random/seasonal swap happens post-mount.
  const [emoji, setEmoji] = React.useState(logoThumbsUp);

  React.useEffect(() => {
    if (new Date().getMonth() === 11) {
      setEmoji(logoSanta);
      return;
    }
    const map = [logoBeer, logoCheer, logoThumbsUp];
    setEmoji(map[Math.floor(Math.random() * 3)]);
  }, []);

  return (
    <Link to="/" className="navbar-item" aria-label="Homepage">
      <img src={emoji}
        alt="Emoji of Seán (varies between santa, thumbs up, cheering)"
        className="emjoiLogo"/>
      <h1 className="logoText">Seán McNamara</h1>
    </Link>
  );
};

export default NavbarLogo;
