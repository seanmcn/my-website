import React from 'react'
import './navbarItemSocial.scss'

const NavbarItemSocial = props => {
  const { link, label, icon } = props
  return (
    <a
      className="navbar-item"
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <span className="icon">
        <i className={`fab ${icon} fa-2x`} />
      </span>
    </a>
  )
}

export default NavbarItemSocial
