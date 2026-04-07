import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import './projects.scss';

const ProjectsPage = ({data}) => {
  const {
    title: siteTitle,
    siteUrl,
  } = data.site.siteMetadata;
  const projects = data.projects.nodes
    .map(({childMdx}) => childMdx)
    .filter(Boolean);
  const description = 'A collection of projects, experiments, and tools I have built across Go, TypeScript, Python, and the web.';

  return (
    <Layout>
      <RuntimeSeoSync
        title={`Projects - ${siteTitle}`}
        description={description}
        pathname="/projects/"
        siteUrl={siteUrl}
      />
      <div className="projectsPage">
        <section className="projectsHero box">
          <div className="projectsHeroContent">
            <div className="projectsHeroEyebrow">Projects</div>
            <h1 className="title projectsHeroTitle">Things I&apos;ve Built</h1>
            <p className="projectsHeroLead">
              A collection of side projects, experiments, and tools I&apos;ve
              enjoyed working on over the years.
            </p>
          </div>
        </section>

        <section className="projectsList" aria-label="Project listing">
          {projects.map((project) => {
            const image = getImage(project.frontmatter.featured);

            return (
              <Link
                className="projectsCard box"
                key={project.id}
                to={`/projects/${project.frontmatter.slug}/`}
              >
                <div className="projectsCardMeta">
                  <span className="projectsCardLanguage">
                    {project.frontmatter.language}
                  </span>
                  <span className="projectsCardDate">
                    {project.frontmatter.date}
                  </span>
                </div>
                <h2 className="title projectsCardTitle">
                  {project.frontmatter.title}
                </h2>
                {image && (
                  <GatsbyImage
                    image={image}
                    alt={project.frontmatter.title}
                    className="projectsCardImage"
                    imgStyle={{objectFit: 'cover', objectPosition: 'top left'}}
                  />
                )}
                <p className="projectsCardSummary">
                  {project.frontmatter.summary}
                </p>
                <span className="projectsCardLink">View project</span>
              </Link>
            );
          })}
        </section>
      </div>
    </Layout>
  );
};

ProjectsPage.propTypes = {
  data: PropTypes.shape({
    projects: PropTypes.shape({
      nodes: PropTypes.array,
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.object,
    }),
  }).isRequired,
};

export default ProjectsPage;

export const query = graphql`
  query ProjectsPageQuery {
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
            date(formatString: "D MMMM YYYY")
            featured {
              childImageSharp {
                gatsbyImageData(
                  width: 960
                  height: 560
                  placeholder: BLURRED
                  transformOptions: {cropFocus: NORTH}
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
  const title = `Projects - ${siteTitle}`;
  const description = 'A collection of projects, experiments, and tools I have built across Go, TypeScript, Python, and the web.';

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description={description}
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
