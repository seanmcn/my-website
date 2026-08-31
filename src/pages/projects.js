import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {stackColour} from '../utils/projects';
import './projects.scss';

const BLURB = 'Side projects, experiments, and tools I\'ve enjoyed working ' +
  'on over the years.';

const ProjectsPage = ({data}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const projects = data.projects.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean);
  const [stack, setStack] = React.useState('All');

  const stackCounts = projects.reduce((counts, project) => {
    const language = project.frontmatter.language || 'Other';

    return {...counts, [language]: (counts[language] || 0) + 1};
  }, {});
  const stacks = Object.keys(stackCounts)
      .sort((left, right) => stackCounts[right] - stackCounts[left]);
  const maxStackCount = Math.max(...Object.values(stackCounts), 1);

  const allTags = projects.reduce((tags, project) => {
    (project.frontmatter.tags || []).forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag);
      }
    });

    return tags;
  }, []);

  const filtered = projects.filter(
      project => stack === 'All' || project.frontmatter.language === stack,
  );

  // Grouped by year, newest first — the archive reads as a career, not a grid.
  const years = filtered.reduce((groups, project) => {
    const year = (project.frontmatter.date || '').slice(0, 4);
    const group = groups.find(candidate => candidate.year === year);

    if (group) {
      group.items.push(project);
    } else {
      groups.push({year, items: [project]});
    }

    return groups;
  }, []);

  const resultLine = stack === 'All' ?
    `${filtered.length} projects` :
    `${filtered.length} in ${stack}`;

  return (
    <Layout>
      <RuntimeSeoSync
        description={BLURB}
        pathname="/projects/"
        siteUrl={siteUrl}
        title={`Projects - ${siteTitle}`}
      />
      <div className="pageWrap projectsPage">
        <div className="twoCol twoCol--padded">
          <div className="mobileIntro">
            <div className="eyebrow">Projects &middot; {projects.length}</div>
            <p>{BLURB}</p>
          </div>

          <aside className="rail projectsRail">
            <div className="rail__intro">
              <div className="eyebrow">Projects &middot; {projects.length}</div>
              <p className="projectsRail__blurb">{BLURB}</p>
            </div>

            <div>
              <div className="railHeading projectsRail__heading">Stacks</div>
              {stacks.map((name) => {
                const active = stack === name;

                return (
                  <button
                    className={
                      `projectsRail__stack ${active ? 'is-active' : ''}`
                    }
                    key={name}
                    onClick={() => setStack(active ? 'All' : name)}
                    type="button"
                  >
                    <span className="projectsRail__stackHead">
                      <span className="projectsRail__stackName">
                        <span
                          className="projectsRail__dot"
                          style={{background: stackColour(name)}}
                        />
                        {name}
                      </span>
                      <span className="projectsRail__stackTail">
                        {active ? '✕' : stackCounts[name]}
                      </span>
                    </span>
                    <span
                      className="projectsRail__bar"
                      style={{
                        width: `${Math.round(
                            (stackCounts[name] / maxStackCount) * 100,
                        )}%`,
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {allTags.length > 0 && (
              <div>
                <div className="railHeading projectsRail__heading">Tags</div>
                <div className="projectsRail__tags">
                  {allTags.map(tag => (
                    <span className="projectsRail__tag" key={tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div>
            <h1 className="visually-hidden">Projects</h1>
            <div className="stickyBar projectsBar">
              <span className="projectsBar__results">{resultLine}</span>
              {stack !== 'All' && (
                <button
                  className="projectsBar__clear"
                  onClick={() => setStack('All')}
                  type="button"
                >
                  Clear filter &times;
                </button>
              )}
              <span className="projectsBar__order">Newest first</span>
            </div>

            {years.map(group => (
              <div className="projectsYear" key={group.year}>
                <div className="projectsYear__head">
                  <span className="projectsYear__label">{group.year}</span>
                  <span className="projectsYear__line" />
                  <span className="projectsYear__count">
                    {group.items.length}{' '}
                    {group.items.length === 1 ? 'project' : 'projects'}
                  </span>
                </div>

                {group.items.map((project) => {
                  const image = getImage(project.frontmatter.featured);

                  return (
                    <Link
                      className="projectRow"
                      key={project.id}
                      to={`/projects/${project.frontmatter.slug}/`}
                    >
                      {image ? (
                        <span className="projectRow__thumb">
                          <GatsbyImage alt="" image={image} />
                        </span>
                      ) : (
                        <span
                          className="projectRow__thumb projectRow__thumb--blank"
                        />
                      )}
                      <span className="projectRow__body">
                        <span>
                          <span className="projectRow__name">
                            {project.frontmatter.title}
                          </span>
                          <span className="projectRow__blurb">
                            {' '}&mdash; {project.frontmatter.summary}
                          </span>
                        </span>
                        <span className="projectRow__foot">
                          {(project.frontmatter.tags || []).length > 0 && (
                            <span className="projectRow__tags">
                              {project.frontmatter.tags.map(tag => (
                                <span className="projectRow__tag" key={tag}>
                                  {tag}
                                </span>
                              ))}
                            </span>
                          )}
                          <span
                            className="projectRow__stack"
                            style={{
                              background: stackColour(
                                  project.frontmatter.language,
                              ),
                            }}
                          >
                            {project.frontmatter.language}
                          </span>
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
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
            tags
            date
            featured {
              childImageSharp {
                gatsbyImageData(
                  width: 208
                  height: 176
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

  return (
    <>
      <title>{title}</title>
      <SEO
        description={BLURB}
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
      />
    </>
  );
};
