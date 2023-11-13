import React from 'react';
import {graphql} from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout';
import Sidebar from '../components/sidebar/sidebar';

export default class AboutPage extends React.Component {
  render() {
    const {data} = this.props;
    const {title: siteTitle} = data.site.siteMetadata;

    return (
      <Layout>
        <Helmet>
          <title>{`About Me - ${siteTitle}`}</title>
        </Helmet>
        <div className="columns">
          <div className="column is-one-fifth-desktop">
            <Sidebar/>
          </div>
          <div className="column">
            <div className="box">
              <h1 className="title">A Peek Into My Journey</h1>
              <div className="content">
                <p>
                  Hey there! I&apos;m a coding enthusiast turned professional,
                  starting my journey with the ABCs of HTML and CSS. It
                  wasn&apos;t long before PHP and I became best buddies, laying
                  a solid foundation for my web development adventures.
                </p>
                <p>
                  My professional saga began in the quaint town of Kilkenny,
                  Ireland, as a freelance developer. I dove into the world of
                  WordPress, crafting plugins and themes, and exploring the
                  realms of e-commerce. It was more than just coding; it was
                  about bringing ideas to life and mastering the art of
                  collaboration.
                </p>
                <p>
                  My next chapter unfolded in Canada, where I joined the
                  University of British Columbia&apos;s Library IT Services.
                  This experience was a game-changer, enhancing my tech skills
                  and teaching me the art of interpersonal communication.
                </p>
                <p>
                  While I&apos;m a backend development aficionado, I didn&apos;t
                  shy away from using ReactJS for this website. I admire its
                  flair but just so you know, frontend isn&apos;t my main stage.
                </p>
                <p>
                  Recently, I&apos;ve been flirting with Golang and wading into
                  the exciting waters of artificial intelligence, specifically
                  working on GPT integrations. It&apos;s a thrilling new
                  frontier!
                </p>
                <p>
                  Currently, I&apos;m part of a leading dating app company,
                  diving into innovative projects and constantly evolving.
                  I&apos;m also looking to sprinkle some open-source magic into
                  my work, marrying my professional goals with my passion for
                  open-source principles.
                </p>
                <p>
                  A chapter of my story also includes a deep dive into
                  hospitality technology during my time at Kobas. It&apos;s an
                  experience that has enriched my understanding of this unique
                  sector.
                </p>
                <p>
                  As a tech enthusiast, I&apos;m committed to the open-source
                  community. My toolkit is pretty diverse, ranging from Python
                  for backend magic, PHP for web wizardry, to my growing
                  expertise in Golang and AI tech.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

AboutPage.propTypes = {};

export const aboutPageQuery = graphql`
  query aboutPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
