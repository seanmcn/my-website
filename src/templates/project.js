import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Modal from 'react-modal';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import './project.scss';

if (typeof document !== 'undefined') {
  Modal.setAppElement('#___gatsby');
}

const ProjectTemplate = ({data, children, location}) => {
  const {mdx: project, site} = data;
  const {
    title,
    summary,
    slug,
    language,
    repo,
    demo,
    tags,
    techStack,
    featured,
    gallery = [],
  } = project.frontmatter;
  const image = getImage(featured);
  const pageTitle = `${title} - Projects - ${site.siteMetadata.title}`;
  const galleryItems = (gallery || []).filter(item => item?.image);
  const hasGallery = galleryItems.length > 0;
  const [activeGalleryIndex, setActiveGalleryIndex] = React.useState(0);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = React.useState(false);
  const activeGalleryItem = galleryItems[activeGalleryIndex] || null;
  const activeGalleryImage = getImage(activeGalleryItem?.image);

  return (
    <Layout>
      <RuntimeSeoSync
        title={pageTitle}
        description={summary || project.excerpt}
        pathname={location?.pathname || `/projects/${slug}/`}
        siteUrl={site.siteMetadata.siteUrl}
      />
      <div className="projectPage">
        <Link className="projectBackLink" to="/projects/">
          ← Back to all projects
        </Link>

        <section className="projectHero">
          <div className="projectHeroInner">
            <div className="projectHeroEyebrow">
              <span>Project</span>
              {language && <span className="projectHeroEyebrowDot">·</span>}
              {language && <span className="projectHeroLanguage">{language}</span>}
            </div>
            <h1 className="projectHeroTitle">{title}</h1>
            {summary && (
              <p className="projectHeroLead">{summary}</p>
            )}
          </div>
          {(repo || demo) && (
            <div className="projectHeroActions">
              {repo && (
                <a
                  className="projectActionButton projectActionButton--primary"
                  href={repo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View repository
                </a>
              )}
              {demo && (
                <a
                  className="projectActionButton projectActionButton--primary"
                  href={demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View website
                </a>
              )}
            </div>
          )}
        </section>

        <section className={`projectStory ${(image || hasGallery) ? 'has-media' : ''}`}>
          {(image || hasGallery) && (
            <aside className="projectStoryMedia">
              <div className="projectStoryMediaSticky">
                {hasGallery && activeGalleryImage ? (
                  <button
                    type="button"
                    className="projectStoryThumb"
                    onClick={() => setIsGalleryModalOpen(true)}
                    aria-label="Zoom image"
                  >
                    <GatsbyImage
                      image={activeGalleryImage}
                      alt={activeGalleryItem.alt}
                      imgStyle={{objectFit: 'contain', objectPosition: 'top center'}}
                    />
                    <span className="projectStoryThumbHint">Click to zoom</span>
                  </button>
                ) : (
                  image && (
                    <div className="projectStoryThumb">
                      <GatsbyImage image={image} alt={title} />
                    </div>
                  )
                )}
                {hasGallery && activeGalleryItem?.caption && (
                  <p className="projectStoryThumbCaption">{activeGalleryItem.caption}</p>
                )}
                {hasGallery && galleryItems.length > 1 && (
                  <div className="projectStoryThumbRail" aria-label="Gallery thumbnails">
                    {galleryItems.map((item, index) => {
                      const thumbImage = getImage(item.image);
                      if (!thumbImage) return null;
                      return (
                        <button
                          type="button"
                          key={`${item.alt}-${index}`}
                          className={
                            index === activeGalleryIndex ?
                              'projectStoryThumbDot is-active' :
                              'projectStoryThumbDot'
                          }
                          onClick={() => setActiveGalleryIndex(index)}
                          aria-label={`Show image ${index + 1}: ${item.alt}`}
                        >
                          <GatsbyImage
                            image={thumbImage}
                            alt={item.alt}
                            imgStyle={{objectFit: 'cover', objectPosition: 'top center'}}
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          )}
          <div className="content projectStoryContent">
            {children}
          </div>
          <aside className="projectStoryMeta">
            {techStack && techStack.length ? (
              <div className="projectStoryMetaBlock">
                <span className="projectStoryMetaLabel">Tech stack</span>
                <ul className="projectStoryMetaTags">
                  {techStack.map((item) => (
                    <li className="projectStoryMetaTag" key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {tags && tags.length ? (
              <div className="projectStoryMetaBlock">
                <span className="projectStoryMetaLabel">Tags</span>
                <ul className="projectStoryMetaTags">
                  {tags.map((tag) => (
                    <li className="projectStoryMetaTag" key={tag}>#{tag}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </section>
      </div>

      {activeGalleryImage && (
        <Modal
          isOpen={isGalleryModalOpen}
          onRequestClose={() => setIsGalleryModalOpen(false)}
          className="projectGalleryModal"
          overlayClassName="projectGalleryModalOverlay"
          contentLabel={`${title} gallery image`}
        >
          <button
            type="button"
            className="projectGalleryModalClose"
            onClick={() => setIsGalleryModalOpen(false)}
            aria-label="Close image preview"
          >
            ×
          </button>
          <GatsbyImage
            image={activeGalleryImage}
            alt={activeGalleryItem.alt}
            className="projectGalleryModalImage"
            imgStyle={{objectFit: 'contain', objectPosition: 'top center'}}
          />
          {activeGalleryItem.caption && (
            <p className="projectGalleryModalCaption">
              {activeGalleryItem.caption}
            </p>
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
        featured {
          childImageSharp {
            gatsbyImageData(
              width: 1400
              height: 780
              placeholder: BLURRED
            )
          }
        }
        gallery {
          alt
          caption
          image {
            childImageSharp {
              gatsbyImageData(
                width: 1400
                placeholder: BLURRED
              )
            }
          }
        }
      }
    }
  }
`;

export const Head = ({data, location}) => {
  const {mdx: project, site} = data;
  const title = `${project.frontmatter.title} - Projects - ${site.siteMetadata.title}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description={project.frontmatter.summary || project.excerpt}
        siteTitle={site.siteMetadata.title}
        siteDescription={site.siteMetadata.description}
        siteUrl={site.siteMetadata.siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
