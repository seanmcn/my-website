import React from 'react';
import {Link} from 'gatsby';
import avatar from '../../../assets/images/emojis/250/wave.png';
import './aboutMe.scss';

const AboutMeWidget = () => (
  <div className="box aboutMeCard">
    <div className="aboutMeIntro">
      <figure className="image is-128x128 aboutMeImage">
        <img src={avatar} alt="Avatar displaying Seán waving" width={'250px'}
          height={'250px'}/>
      </figure>
      <div className="aboutMeCopy">
        <h2 className="aboutMeTitle">About Me</h2>
        <p className="aboutMeText">
          Hello and welcome to my website, which has been online since 2006.
          On here you&apos;ll find anything I thought was interesting enough
          to write a blog post about throughout the years.
        </p>
      </div>
    </div>

    <div className="aboutMeFooter">
      <Link
        to="/about"
        className="button is-small is-fullwidth aboutMeButton"
        aria-label="Read more about me">
        Read more
      </Link>
    </div>
  </div>
);

export default AboutMeWidget;
