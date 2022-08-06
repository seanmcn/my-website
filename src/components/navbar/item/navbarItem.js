import {Link} from 'gatsby';
import React from 'react';

const NavbarItem = (props) => {
  const {link, label} = props;
  return (
    <Link to={link} className="navbar-item is-capitalized" aria-label={label}>
      {label}
    </Link>
  );
};

export default NavbarItem;
