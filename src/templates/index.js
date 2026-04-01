import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout';
import LatestPostsHomeWidget from '../components/widgets/latestPosts/latestPostsHome';
import StaticData from '../data/static.json';
import avatar from '../assets/images/emojis/250/wave.png';
import './index.scss';

export default class IndexPage extends React.Component {
  render() {
    const {data} = this.props;
    const {
      title: siteTitle,
      description: siteDescription,
    } = data.site.siteMetadata;
    return (
      <Layout>
        <Helmet>
          <title>{`Home - ${siteTitle}`}</title>
          <meta name="description" content={`${siteDescription}`} />
        </Helmet>
        <div className="homePage">
          <section className="homeSection">
            <div className="homeSectionHeader">
              <div>
                <div className="homeSectionEyebrow">About</div>
                <h1 className="title homeSectionTitle">A quick introduction</h1>
              </div>
            </div>
            <div className="homeAboutCard box">
              <div className="homeAboutImageWrap">
                <figure className="homeAboutImage">
                  <img
                    src={avatar}
                    alt="Avatar displaying Seán waving"
                    width={'250px'}
                    height={'250px'}
                  />
                </figure>
              </div>
              <div className="homeAboutContent">
                <p className="homeAboutLead">
                  I&apos;m a backend-focused software engineer with a long-running
                  interest in practical tools, clean product thinking, and
                  useful software.
                </p>
                <p className="homeAboutText">
                  I started out with HTML, CSS, and PHP, then built a career
                  across freelance web work, digital archives at UBC,
                  hospitality technology at Kobas, and large-scale backend
                  systems at Bumble.
                </p>
                <p className="homeAboutText">
                  These days I&apos;m especially interested in backend
                  engineering, AI-assisted workflows, and building smaller
                  tools that are thoughtful, fast, and useful.
                </p>
                <div className="homeAboutFooter">
                  <Link className="button homeAboutButton" to="/about">
                    Read more about me
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="homeSection">
            <div className="homeSectionHeader">
              <div>
                <div className="homeSectionEyebrow">Projects</div>
                <h2 className="title homeSectionTitle">Things I&apos;ve built</h2>
              </div>
              <p className="homeSectionIntro">
                A few projects and experiments I&apos;ve enjoyed working on.
              </p>
            </div>
            <div className="homeProjectsGrid">
              {StaticData.github_repos.map(project => (
                <a
                  className="homeProjectCard"
                  href={project.link}
                  key={project.id}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <div className="homeProjectMeta">{project.language}</div>
                  <h3 className="homeProjectTitle">{project.title}</h3>
                  <p className="homeProjectDescription">
                    {project.description}
                  </p>
                  <span className="homeProjectLink">View repository</span>
                </a>
              ))}
            </div>
          </section>

          <section className="homeSection homeWritingSection">
            <div className="homeSectionHeader">
              <div>
                <div className="homeSectionEyebrow">Writing</div>
                <h2 className="title homeSectionTitle">Recent posts</h2>
              </div>
              <p className="homeSectionIntro">
                A few recent posts on software, workflow, and other things
                worth writing down.
              </p>
            </div>
            <LatestPostsHomeWidget />
          </section>
        </div>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allWordpressPost: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      edges: PropTypes.array,
    }),
  }),
  pageContext: PropTypes.shape({
    currentPage: PropTypes.number,
    numPages: PropTypes.number,
  }),
};

export const indexPageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
