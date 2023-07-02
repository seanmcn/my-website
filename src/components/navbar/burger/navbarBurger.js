import React from 'react';
import './navbarBurger.scss';

const NavbarBurger = (props) => {
  const {toggleMenu, active} = props;
  return (
    <button
      type="button"
      onClick={toggleMenu}
      className={`button navbar-burger ${active ? 'is-active' : ''}`}
      aria-label={'Mobile navigation'}
    >
      <span />
      <span />
      <span />
    </button>
  );
};

export default NavbarBurger;
