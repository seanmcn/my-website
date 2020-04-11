import React from 'react'
import { Link } from 'gatsby'
import avatar from '../../assets/images/picture-of-me.jpg'

const AboutMeWidget = () => (
  <div className="box">
    <div className="columns">
      <div className="column is-half-widescreen is-offset-one-quarter-widescreen is-half-mobile is-offset-one-quarter-mobile is-half-desktop is-offset-2-desktop">
        <figure className="image is-128x128">
          <img
            className="is-rounded"
            src={avatar}
            alt="Sean jumping on top of a mountain"
          />
        </figure>
      </div>
    </div>
    <p>
      Hello and welcome to my website, which has been&nbsp;
      <Link
        to="https://web.archive.org/web/*/seanmcn.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Archive.org link for this website"
      >
        online since 2006
      </Link>
      . On here you&apos;ll find anything I thought was interesting enough to
      write a blog post about throughout the years.
    </p>
    <br />
    <Link to="/about" className="navbar-item" aria-label="Read more about me">
      <button className="button is-small is-fullwidth" type="button">
        Read more
      </button>
    </Link>
  </div>
)

export default AboutMeWidget
