import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import LatestPostsHomeWidget from '../components/widgets/latestPosts/latestPostsHome';
import StaticData from '../data/static.json';
import avatar from '../assets/images/emojis/250/wave.png';
import './index.scss';

export default class IndexPage extends React.Component {
  render() {
    const {
      title: siteTitle,
      description: siteDescription,
      siteUrl,
    } = this.props.data.site.siteMetadata;

    return (
      <Layout>
        <RuntimeSeoSync
          title={`Home - ${siteTitle}`}
          description={siteDescription}
          pathname="/"
          siteUrl={siteUrl}
        />
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
                  I&apos;m a software engineer who likes building things that are simple, fast, and actually useful.
                </p>
                <p className="homeAboutText">
                  Ive worked across everything from digital archives at UBC to hospitality systems at Kobas, and later large-scale backend services at Bumble focused on recommendations and discovery.
                </p>
                <p className="homeAboutText">
                  Between shipping quickly in smaller teams and working on systems at scale, I&rsquo;ve developed a bias toward keeping things simple and practical.
                </p>
                <p className="homeAboutText">
                  These days I&rsquo;m mostly interested in backend engineering, AI-assisted workflows, and building smaller tools with a strong focus on usability and performance.               
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
        siteUrl
      }
    }
  }
`;

export const Head = ({data, location}) => {
  const {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
  } = data.site.siteMetadata;
  const title = `Home - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description={siteDescription}
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
