import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import LatestPostsHomeWidget from '../components/widgets/latestPosts/latestPostsHome';
import avatar from '../assets/images/emojis/250/wave.png';
import './index.scss';

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProjectIndex: 0,
      projectsPerView: 3,
    };
  }

  componentDidMount() {
    this.updateProjectsPerView();
    window.addEventListener('resize', this.updateProjectsPerView);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateProjectsPerView);
  }

  updateProjectsPerView = () => {
    const projects = this.props.data.projects.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean);
    let projectsPerView = 3;

    if (window.innerWidth <= 768) {
      projectsPerView = 1;
    } else if (window.innerWidth <= 1023) {
      projectsPerView = 2;
    }

    this.setState(prevState => {
      const maxIndex = Math.max(
        projects.length - projectsPerView,
        0
      );

      if (
        prevState.projectsPerView === projectsPerView &&
        prevState.currentProjectIndex <= maxIndex
      ) {
        return null;
      }

      return {
        projectsPerView,
        currentProjectIndex: Math.min(prevState.currentProjectIndex, maxIndex),
      };
    });
  };

  moveProjects = direction => {
    const projects = this.props.data.projects.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean);
    this.setState(prevState => {
      const maxIndex = Math.max(
        projects.length - prevState.projectsPerView,
        0
      );
      const step = prevState.projectsPerView;

      return {
        currentProjectIndex: Math.min(
          Math.max(prevState.currentProjectIndex + direction * step, 0),
          maxIndex
        ),
      };
    });
  };

  render() {
    const {
      title: siteTitle,
      description: siteDescription,
      siteUrl,
    } = this.props.data.site.siteMetadata;
    const projects = this.props.data.projects.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean);
    const {currentProjectIndex, projectsPerView} = this.state;
    const maxProjectIndex = Math.max(
      projects.length - projectsPerView,
      0
    );
    const projectPositions = [];
    for (let index = 0; index <= maxProjectIndex; index += projectsPerView) {
      projectPositions.push(index);
    }
    if (projectPositions[projectPositions.length - 1] !== maxProjectIndex) {
      projectPositions.push(maxProjectIndex);
    }
    const projectTrackStyle = {
      '--projects-per-view': projectsPerView,
      transform: `translateX(calc(-${currentProjectIndex} * ((100% - (${projectsPerView} - 1) * 1rem) / ${projectsPerView} + 1rem)))`,
    };

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
            <div className="homeProjectsCarousel">
              <button
                className="homeProjectsArrow homeProjectsArrowLeft"
                type="button"
                onClick={() => this.moveProjects(-1)}
                disabled={currentProjectIndex === 0}
                aria-label="Show previous projects"
              >
                ‹
              </button>
              <div className="homeProjectsViewport" aria-label="Project list">
                <div className="homeProjectsTrack" style={projectTrackStyle}>
                  {projects.map(project => {
                    const image = getImage(project.frontmatter.featured);

                    return (
                    <Link
                      className="homeProjectCard"
                      to={`/projects/${project.frontmatter.slug}/`}
                      key={project.id}
                    >
                      <div className="homeProjectMeta">
                        {project.frontmatter.language}
                      </div>
                      <h3 className="homeProjectTitle">
                        {project.frontmatter.title}
                      </h3>
                      {image && (
                        <GatsbyImage
                          image={image}
                          alt={project.frontmatter.title}
                          className="homeProjectImage"
                        />
                      )}
                      <p className="homeProjectDescription">
                        {project.frontmatter.summary}
                      </p>
                      <span className="homeProjectLink">View project</span>
                    </Link>
                    );
                  })}
                </div>
              </div>
              <button
                className="homeProjectsArrow homeProjectsArrowRight"
                type="button"
                onClick={() => this.moveProjects(1)}
                disabled={currentProjectIndex >= maxProjectIndex}
                aria-label="Show more projects"
              >
                ›
              </button>
            </div>
            <div className="homeProjectsPagination" aria-hidden="true">
              {projectPositions.map(position => (
                <span
                  key={position}
                  className={
                    position === currentProjectIndex
                      ? 'homeProjectsPaginationDot is-active'
                      : 'homeProjectsPaginationDot'
                  }
                />
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
    projects: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      nodes: PropTypes.array,
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.object,
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
    projects: allFile(
      filter: {sourceInstanceName: {eq: "projects"}, childMdx: {id: {ne: null}}}
      sort: {childMdx: {frontmatter: {date: DESC}}}
    ) {
      nodes {
        childMdx {
          id
          frontmatter {
            title
            slug
            summary
            language
            featured {
              childImageSharp {
                gatsbyImageData(
                  width: 720
                  height: 420
                  placeholder: BLURRED
                )
              }
            }
          }
        }
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
