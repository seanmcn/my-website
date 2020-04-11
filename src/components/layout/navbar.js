import React from 'react'
import { Link } from 'gatsby'
import logo from '../../assets/images/logo.png'

const Navbar = () => (
  <nav
    className="navbar is-fixed-top"
    role="navigation"
    aria-label="main navigation"
  >
    <div className="container">
      <div className="navbar-brand">
        <Link to="/" className="navbar-item" aria-label="Homepage">
          <figure className="image">
            <img src={logo} alt="Sean McNamara" />
          </figure>
        </Link>
      </div>

      <div className="navbar-menu">
        <Link to="/" className="navbar-item" aria-label="Homepage">
          Home
        </Link>

        <Link to="/blog" className="navbar-item" aria-label="About">
          Blog
        </Link>

        <Link to="/about" className="navbar-item" aria-label="About">
          About Me
        </Link>

        {/*<Link to="/portfolio" className="navbar-item" aria-label="Contact">*/}
        {/*  Portfolio*/}
        {/*</Link>*/}

        <Link to="/contact" className="navbar-item" aria-label="Contact">
          Contact
        </Link>
      </div>

      <div className="navbar-end is-desktop">
        <a
          className="navbar-item"
          href="https://www.linkedin.com/in/mrseanmcn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
        >
          <span className="icon">
            <i className="fab fa-linkedin fa-2x" />
          </span>
        </a>

        <a
          className="navbar-item"
          href="https://github.com/seanmcn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Github Profile"
        >
          <span className="icon">
            <i className="fab fa-github-alt fa-2x" />
          </span>
        </a>

        {/*<a*/}
        {/*  className="navbar-item"*/}
        {/*  href="https://www.hackerrank.com/mrseanmcn"*/}
        {/*  target="_blank"*/}
        {/*  rel="noopener noreferrer"*/}
        {/*  aria-label="HackerRank Profile"*/}
        {/*>*/}
        {/*  <span className="icon">*/}
        {/*    <i className="fab fa-hackerrank fa-2x" />*/}
        {/*  </span>*/}
        {/*</a>*/}

        <a
          className="navbar-item"
          href="https://www.goodreads.com/seanmcn"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GoodReads Profile"
        >
          <span className="icon">
            <i className="fab fa-goodreads fa-2x" />
          </span>
        </a>
      </div>
    </div>
  </nav>
)

export default Navbar
