import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Modal from 'react-modal';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {ArrowLeftIcon, CalendarIcon} from '../components/icons/icons';
import useCondensedHeader from '../hooks/useCondensedHeader';
import {formatLongDate} from '../utils/content';
import './project.scss';

if (typeof document !== 'undefined') {
  Modal.setAppElement('#___gatsby');
}

const ProjectTemplate = ({children, data, location}) => {
  const {mdx: project, site, others} = data;
  const {
    title,
    summary,
    slug,
    repo,
    demo,
    tags,
    techStack,
    date,
    featured,
    gallery = [],
  } = project.frontmatter;

  const condensed = useCondensedHeader();
  const shots = (gallery || []).filter(item => item?.image);
  const [activeShot, setActiveShot] = React.useState(0);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const shot = shots[activeShot] || null;
  const shotImage = getImage(shot?.image);
  const featuredImage = getImage(featured);
  const otherProjects = others.nodes
      .map(({childMdx}) => childMdx)
      .filter(Boolean)
      .filter(other => other.frontmatter.slug !== slug)
      .slice(0, 4);
  const pageTitle = `${title} - Projects - ${site.siteMetadata.title}`;

  const step = React.useCallback((direction) => {
    if (shots.length < 2) {
      return;
    }

    setActiveShot(index => (index + direction + shots.length) % shots.length);
  }, [shots.length]);

  React.useEffect(() => {
    if (!lightboxOpen) {
      return undefined;
    }

    const onKey = (event) => {
      if (event.key === 'ArrowLeft') step(-1);
      if (event.key === 'ArrowRight') step(1);
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, step]);

  const counter = shots.length ?
    `${String(activeShot + 1).padStart(2, '0')} / ` +
      `${String(shots.length).padStart(2, '0')}` :
    '';

  return (
    <Layout>
      <RuntimeSeoSync
        description={summary || project.excerpt}
        pathname={location?.pathname || `/projects/${slug}/`}
        siteUrl={site.siteMetadata.siteUrl}
        title={pageTitle}
      />
      <div className="pageWrap projectPage">
        <article className="projectPage__article">
          <div className={`itemBar ${condensed ? 'is-condensed' : ''}`}>
            <Link className="itemBar__back" to="/projects/">
              <ArrowLeftIcon />
              Projects
            </Link>
            <h1 className="itemBar__title">{title}</h1>
            <span className="itemBar__date">
              <CalendarIcon />
              {formatLongDate(date)}
            </span>
          </div>

          {summary && <p className="projectPage__lead">{summary}</p>}

          {(shot || featuredImage) && (
            <figure className="projectShots">
              <figcaption className="projectShots__head">
                <span>{counter || 'Featured'}</span>
                <span>{shot?.alt || title}</span>
              </figcaption>
              <button
                aria-label="Expand image"
                className="projectShots__stage"
                onClick={() => setLightboxOpen(true)}
                type="button"
              >
                <GatsbyImage
                  alt={shot?.alt || title}
                  image={shotImage || featuredImage}
                  objectFit="contain"
                />
                <span className="projectShots__expand">Expand ⤢</span>
              </button>

              {shots.length > 1 && (
                <div className="projectShots__rail">
                  {shots.map((item, index) => {
                    const thumb = getImage(item.image);

                    if (!thumb) {
                      return null;
                    }

                    return (
                      <button
                        aria-label={`Show image ${index + 1}: ${item.alt}`}
                        className={`projectShots__thumb ${
                          index === activeShot ? 'is-active' : ''
                        }`}
                        key={item.alt || index}
                        onClick={() => setActiveShot(index)}
                        type="button"
                      >
                        <GatsbyImage alt={item.alt} image={thumb} />
                        <span className="projectShots__num">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {(shot?.caption || shot?.alt) && (
                <p className="projectShots__caption">
                  {shot.caption || shot.alt}
                </p>
              )}
            </figure>
          )}

          <div className="projectPage__divider" />
          <div className="prose">{children}</div>
        </article>

        <aside className="rightRail projectRail">
          {repo && (
            <a
              className="projectRail__cta"
              href={repo}
              rel="noopener noreferrer"
              target="_blank"
            >
              View repository ↗
            </a>
          )}
          {demo && (
            <a
              className="projectRail__cta projectRail__cta--secondary"
              href={demo}
              rel="noopener noreferrer"
              target="_blank"
            >
              View website ↗
            </a>
          )}

          <div>
            <div className="railBlock__label">Started</div>
            <div className="projectRail__value">{formatLongDate(date)}</div>
          </div>

          {techStack && techStack.length > 0 && (
            <div className="railBlock">
              <div className="railBlock__label">Tech stack</div>
              <div className="projectRail__chips">
                {techStack.map(item => (
                  <span className="projectRail__chip" key={item}>{item}</span>
                ))}
              </div>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="railBlock">
              <div className="railBlock__label">Tags</div>
              <div className="projectRail__chips">
                {tags.map(tag => (
                  <span className="projectRail__tag" key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {otherProjects.length > 0 && (
            <div className="railBlock">
              <div className="railBlock__label">Other projects</div>
              {otherProjects.map(other => (
                <Link
                  className="projectRail__other"
                  key={other.frontmatter.slug}
                  to={`/projects/${other.frontmatter.slug}/`}
                >
                  {other.frontmatter.title}{' '}
                  <span className="projectRail__otherStack">
                    {other.frontmatter.language}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>

      {(shotImage || featuredImage) && (
        <Modal
          className="lightbox"
          contentLabel={`${title} gallery image`}
          isOpen={lightboxOpen}
          onRequestClose={() => setLightboxOpen(false)}
          overlayClassName="lightbox__overlay"
        >
          <div className="lightbox__head">
            <span className="lightbox__counter">{counter}</span>
            <span>{shot?.alt || title}</span>
            <button
              className="lightbox__close"
              onClick={() => setLightboxOpen(false)}
              type="button"
            >
              Close ✕
            </button>
          </div>
          <div className="lightbox__stage">
            {shots.length > 1 && (
              <button
                aria-label="Previous image"
                className="lightbox__nav lightbox__nav--prev"
                onClick={() => step(-1)}
                type="button"
              >
                ‹
              </button>
            )}
            <GatsbyImage
              alt={shot?.alt || title}
              className="lightbox__image"
              image={shotImage || featuredImage}
              objectFit="contain"
            />
            {shots.length > 1 && (
              <button
                aria-label="Next image"
                className="lightbox__nav lightbox__nav--next"
                onClick={() => step(1)}
                type="button"
              >
                ›
              </button>
            )}
          </div>
          {(shot?.caption || shot?.alt) && (
            <p className="lightbox__caption">{shot.caption || shot.alt}</p>
          )}
          {shots.length > 1 && (
            <div className="lightbox__rail">
              {shots.map((item, index) => {
                const thumb = getImage(item.image);

                if (!thumb) {
                  return null;
                }

                return (
                  <button
                    aria-label={`Show image ${index + 1}`}
                    className={`lightbox__thumb ${
                      index === activeShot ? 'is-active' : ''
                    }`}
                    key={item.alt || index}
                    onClick={() => setActiveShot(index)}
                    type="button"
                  >
                    <GatsbyImage alt={item.alt} image={thumb} />
                  </button>
                );
              })}
            </div>
          )}
        </Modal>
      )}
    </Layout>
  );
};

ProjectTemplate.propTypes = {
  children: PropTypes.node,
  data: PropTypes.shape({
    mdx: PropTypes.object,
    others: PropTypes.object,
    site: PropTypes.object,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};

export default ProjectTemplate;

export const pageQuery = graphql`
  query ProjectById($id: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    mdx(id: {eq: $id}) {
      id
      excerpt(pruneLength: 180)
      frontmatter {
        title
        slug
        summary
        language
        repo
        demo
        tags
        techStack
        date
        featured {
          childImageSharp {
            gatsbyImageData(width: 1400 placeholder: BLURRED)
          }
        }
        gallery {
          alt
          caption
          image {
            childImageSharp {
              gatsbyImageData(width: 1400 placeholder: BLURRED)
            }
          }
        }
      }
    }
    others: allFile(
      filter: {sourceInstanceName: {eq: "projects"}, childMdx: {id: {ne: null}}}
      sort: {childMdx: {frontmatter: {date: DESC}}}
    ) {
      nodes {
        childMdx {
          frontmatter {
            title
            slug
            language
          }
        }
      }
    }
  }
`;

export const Head = ({data, location}) => {
  const {mdx: project, site} = data;
  const title =
    `${project.frontmatter.title} - Projects - ${site.siteMetadata.title}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        description={project.frontmatter.summary || project.excerpt}
        pathname={location.pathname}
        siteDescription={site.siteMetadata.description}
        siteTitle={site.siteMetadata.title}
        siteUrl={site.siteMetadata.siteUrl}
        title={title}
      />
    </>
  );
};
