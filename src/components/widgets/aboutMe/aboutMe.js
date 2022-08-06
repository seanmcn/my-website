import React from 'react';
import {Link} from 'gatsby';
import avatar from '../../../assets/images/emojis/250/wave.png';
import './aboutMe.scss';

const AboutMeWidget = () => (
  <div className="box">
    <figure className="image is-128x128 aboutMeImage">
      <img src={avatar} alt="Sean jumping on top of a mountain" />
    </figure>
    <hr className="aboutMeImageDivider" />
    <p>
      Hello and welcome to my website, which has been online since 2006 . On
      here you&apos;ll find anything I thought was interesting enough to write a
      blog post about throughout the years.
    </p>
    <br />
    <Link to="/about" className="navbar-item" aria-label="Read more about me">
      <button className="button is-small is-fullwidth" type="button">
        Read more
      </button>
    </Link>
  </div>
);

export default AboutMeWidget;
