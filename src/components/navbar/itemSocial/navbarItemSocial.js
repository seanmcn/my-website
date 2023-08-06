import React from 'react';
import './navbarItemSocial.scss';


const NavbarItemSocial = (props) => {
  const {link, label, children} = props;
  return (
    <a
      className="navbar-item"
      href={link}
      target="_blank"
      rel="noopener noreferrer me"
      aria-label={label}
    >
      <span className="icon">
        {children}
      </span>
    </a>
  );
};

export default NavbarItemSocial;
