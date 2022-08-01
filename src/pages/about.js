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
          <div className="column is-three-quarters">
            <div className="box">
              <h1 className="title">About Me</h1>
              <div
                className="content"
              >
                <p>
                  My journey into the world of programming started at a young
                  age, fuelled by wanting to understand how computers work.
                  I taught myself how to make some basic websites using HTML
                  and CSS, and then quickly moved on to learn PHP.
                </p>
                <p>
                  I entered the world of professional development in Kilkenny,
                  Ireland as a freelancer, working on creating WordPress plugins
                  and themes, and setting up e-commerce platforms. While working
                  for myself had its advantages, I wanted to experience working
                  with teams on larger projects.
                </p>
                <p>
                  I then decided to leave Ireland to move to Canada on a working
                  holiday visa. While there I had the chance to work with some
                  amazing people at both Motbot and U.B.C&apos;s Library I.T.
                  services team. When my working holiday ended, I moved to
                  London, England where I started working at Kobas, a company
                  that creates software for the hospitality industry.
                </p>
                <p>
                  I&apos;m an advocate for open-source software and I&apos;m
                  always trying to open source what I&apos;m working on as much
                  as possible. I try to keep all my personal projects open
                  source, and I&apos;m aiming to do more in this area moving
                  forward.
                </p>
                <p>
                  I&apos;m comfortable with programming in a lot of programming
                  languages, but my two favourites are Python for file
                  parsing/web scraping/console commands and PHP for web
                  projects. Front-end development-wise I&apos;m a fan of
                  ReactJS.
                </p>
              </div>
            </div>
          </div>
          <div className="column is-one-quarter">
            <Sidebar/>
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
