import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {CalendarIcon, CategoryIcon, ClockIcon} from '../components/icons/icons';
import useCondensedHeader from '../hooks/useCondensedHeader';
import avatar from '../assets/images/emojis/250/wave.png';
import {
  formatDayMonth,
  formatItemDate,
  itemPath,
  readTimeLabel,
  slugToTitle,
} from '../utils/content';
import './index.scss';

function formatReadMinutes(minutes) {
  if (minutes >= 60) {
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }

  return `${minutes}m`;
}

/* A post's one-liner: its first margin note if it has one, else its summary. */
function oneLine(node) {
  const margin = (node.frontmatter.margins || [])[0];

  return margin?.text || node.frontmatter.summary || node.excerpt;
}

const HomePage = ({data, pageContext}) => {
  const {title: siteTitle, description, siteUrl} = data.site.siteMetadata;
  const condensed = useCondensedHeader();
  const {counts = {}, readMinutes = 0} = pageContext;
  const posts = data.posts.nodes;
  const notes = data.notes.nodes;
  const finds = data.finds.nodes;
  const projects = data.projects.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean);

  const stats = [
    {label: 'Read time', value: formatReadMinutes(readMinutes)},
    {label: 'Posts', value: counts.post || 0},
    {label: 'Notes', value: counts.note || 0},
    {label: 'Finds', value: counts.find || 0},
  ];

  return (
    <Layout>
      <RuntimeSeoSync
        description={description}
        pathname="/"
        siteUrl={siteUrl}
        title={`Home - ${siteTitle}`}
      />
      <div className="pageWrap homePage">
        <div className="homePage__row">
          <aside className="rail rail--bio homeBio">
            <div className="homeBio__top">
              <p className="homeBio__headline">
                I build things, pull them apart, and try to make them better.
              </p>
              <span className="homeBio__avatarOuter">
                <span
                  className={
                    `homeBio__avatar ${condensed ? 'is-condensed' : ''}`
                  }
                >
                  <img alt="Seán McNamara" src={avatar} />
                </span>
              </span>
            </div>

            <div className="homeBio__body">
              <p className="homeBio__blurb">
                Usually software. Increasingly AI. Mostly me thinking out loud
                about what I&rsquo;m building, learning, or getting
                unnecessarily interested in.
              </p>
              <div className="homeBio__aboutLink">
                <Link to="/about/">More about me →</Link>
              </div>
              <div className="homeBio__role">
                <span className="homeBio__roleDot" />
                <span>
                  Head of Engineering,{' '}
                  <span className="homeBio__roleOrg">Axiom Maths</span>
                </span>
              </div>
            </div>

            <div className="homeBio__stats">
              {stats.map(stat => (
                <div className="homeBio__stat" key={stat.label}>
                  <span>{stat.label}</span>
                  <span className="homeBio__statValue">{stat.value}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="homePage__main">
            <div className="homePage__split">
              <div>
                <div className="sectionRule">
                  <h2
                    className="sectionRule__badge"
                    style={{background: 'var(--plum)'}}
                  >
                    Latest posts
                  </h2>
                  <span className="sectionRule__line" />
                  <Link
                    className="sectionRule__link"
                    style={{color: 'var(--plum)'}}
                    to="/library/posts/"
                  >
                    All posts →
                  </Link>
                </div>

                <div className="homeLead">
                  {posts.map((post) => {
                    const image = getImage(post.frontmatter.featured);
                    const readTime = readTimeLabel(post.fields?.readingTime);

                    return (
                      <Link
                        className="homeLead__card"
                        key={post.id}
                        to={itemPath(post.frontmatter.slug)}
                      >
                        <span className="homeLead__meta">
                          {post.frontmatter.category && (
                            <span className="homeLead__metaCat">
                              <CategoryIcon size={11} />
                              {slugToTitle(post.frontmatter.category)}
                            </span>
                          )}
                          <span className="homeLead__metaDate">
                            <CalendarIcon size={11} />
                            {formatItemDate(post.frontmatter.date)}
                          </span>
                          {readTime && (
                            <span className="homeLead__metaTime">
                              <ClockIcon size={11} />
                              {readTime}
                            </span>
                          )}
                        </span>
                        <span className="homeLead__title">
                          {post.frontmatter.title}
                        </span>
                        <span className="homeLead__body">{oneLine(post)}</span>
                        {image && (
                          <span className="homeLead__image">
                            <GatsbyImage
                              alt=""
                              image={image}
                              objectFit="contain"
                            />
                          </span>
                        )}
                        {readTime && (
                          <span className="homeLead__timeRow">
                            <ClockIcon size={11} />
                            {readTime}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="homeAside">
                <div>
                  <div className="sectionRule">
                    <span
                      className="sectionRule__badge"
                      style={{background: 'var(--blue)'}}
                    >
                      Finds
                    </span>
                    <span className="sectionRule__line" />
                    <Link
                      className="sectionRule__link"
                      style={{color: 'var(--blue)'}}
                      to="/library/finds/"
                    >
                      All finds →
                    </Link>
                  </div>
                  <div className="homeAside__finds">
                    {finds.length === 0 && (
                      <p className="homeAside__empty">
                        Nothing filed yet. Links worth passing on will land
                        here.
                      </p>
                    )}
                    {finds.map((find) => {
                      const {day, monthShort} =
                        formatDayMonth(find.frontmatter.date);

                      return (
                        <Link
                          className="homeAside__find"
                          key={find.id}
                          to={itemPath(find.frontmatter.slug)}
                        >
                          <span className="homeAside__findDate">
                            {day} {monthShort}
                          </span>
                          <span className="homeAside__findTitle">
                            {find.frontmatter.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="sectionRule">
                    <span
                      className="sectionRule__badge"
                      style={{
                        background: 'var(--amber)',
                        color: 'var(--amber-bg)',
                      }}
                    >
                      Notes
                    </span>
                    <span className="sectionRule__line" />
                    <Link
                      className="sectionRule__link"
                      style={{color: 'var(--amber)'}}
                      to="/library/notes/"
                    >
                      All notes →
                    </Link>
                  </div>
                  <div className="homeAside__notes">
                    {notes.length === 0 && (
                      <p className="homeAside__empty">
                        Nothing filed yet. Shorter thoughts will land here.
                      </p>
                    )}
                    {notes.map((note) => {
                      const {day, monthShort} =
                        formatDayMonth(note.frontmatter.date);

                      return (
                        <Link
                          className="homeAside__note"
                          key={note.id}
                          to={itemPath(note.frontmatter.slug)}
                        >
                          <span className="homeAside__noteDate">
                            {day} {monthShort}
                          </span>
                          <span className="homeAside__noteTitle">
                            {note.frontmatter.title}
                          </span>
                          <span className="homeAside__noteExcerpt">
                            {note.frontmatter.summary || note.excerpt}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <section>
              <div className="sectionRule">
                <h2 className="sectionRule__badge">Things I&apos;ve built</h2>
                <span className="sectionRule__line" />
                <Link className="sectionRule__link" to="/projects/">
                  All projects →
                </Link>
              </div>
              <div className="homeProjects">
                {projects.map((project) => {
                  const image = getImage(project.frontmatter.featured);
                  const year = (project.frontmatter.date || '').slice(0, 4);

                  return (
                    <Link
                      className="homeProjects__row"
                      key={project.id}
                      to={`/projects/${project.frontmatter.slug}/`}
                    >
                      {image ? (
                        <span className="homeProjects__thumb">
                          <GatsbyImage alt="" image={image} />
                        </span>
                      ) : (
                        <span
                          className={
                            'homeProjects__thumb homeProjects__thumb--blank'
                          }
                        />
                      )}
                      <span>
                        <span className="homeProjects__meta">
                          {project.frontmatter.language} · {year}
                        </span>
                        <span className="homeProjects__line">
                          <span className="homeProjects__name">
                            {project.frontmatter.title}
                          </span>
                          <span className="homeProjects__blurb">
                            {' '}— {project.frontmatter.summary}
                          </span>
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

HomePage.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

export default HomePage;

export const indexPageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    posts: allMdx(
      filter: {
        fields: {
          sourceInstanceName: {eq: "blog"}
          visible: {eq: true}
          itemType: {eq: "post"}
        }
      }
      sort: {frontmatter: {date: DESC}}
      limit: 3
    ) {
      nodes {
        id
        excerpt(pruneLength: 160)
        fields {
          readingTime
        }
        frontmatter {
          title
          slug
          date
          category
          summary
          margins {
            label
            text
          }
          featured {
            childImageSharp {
              gatsbyImageData(
                width: 320
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
      }
    }
    notes: allMdx(
      filter: {
        fields: {
          sourceInstanceName: {eq: "blog"}
          visible: {eq: true}
          itemType: {eq: "note"}
        }
      }
      sort: {frontmatter: {date: DESC}}
      limit: 3
    ) {
      nodes {
        id
        excerpt(pruneLength: 130)
        frontmatter {
          title
          slug
          date
          summary
        }
      }
    }
    finds: allMdx(
      filter: {
        fields: {
          sourceInstanceName: {eq: "blog"}
          visible: {eq: true}
          itemType: {eq: "find"}
        }
      }
      sort: {frontmatter: {date: DESC}}
      limit: 5
    ) {
      nodes {
        id
        frontmatter {
          title
          slug
          date
        }
      }
    }
    projects: allFile(
      filter: {sourceInstanceName: {eq: "projects"}, childMdx: {id: {ne: null}}}
      sort: {childMdx: {frontmatter: {date: DESC}}}
      limit: 3
    ) {
      nodes {
        childMdx {
          id
          frontmatter {
            title
            slug
            summary
            language
            date
            featured {
              childImageSharp {
                gatsbyImageData(
                  width: 174
                  height: 130
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
  const title = `Home - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        description={siteDescription}
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
      />
    </>
  );
};
