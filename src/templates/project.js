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

        <div className="projectPageGrid">
          <div className="projectMainColumn">
            <section className="projectHero box">
              <div className="projectHeroContent">
                <div className="projectHeroEyebrow">Project</div>
                <h1 className="title projectHeroTitle">{title}</h1>
                {summary && (
                  <p className="projectHeroLead">{summary}</p>
                )}
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
                      className="projectActionButton"
                      href={demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open project
                    </a>
                  )}
                </div>
              </div>
            </section>

            {image && !hasGallery && (
              <section className="projectFeatured box">
                <GatsbyImage image={image} alt={title} className="projectImage" />
              </section>
            )}

            {hasGallery && activeGalleryImage && (
              <section className="projectGallery box">
                <div className="projectGalleryHeader">
                  <h2 className="title projectGalleryTitle">Gallery</h2>
                  <p className="projectGallerySubtitle">
                    Screenshots and interface details from the project.
                  </p>
                </div>
                <div className="projectGalleryShell">
                  <div className="projectGalleryThumbs" aria-label="Gallery thumbnails">
                    {galleryItems.map((item, index) => {
                      const thumbImage = getImage(item.image);

                      if (!thumbImage) {
                        return null;
                      }

                      return (
                        <button
                          type="button"
                          key={`${item.alt}-${index}`}
                          className={
                            index === activeGalleryIndex ?
                              'projectGalleryThumb is-active' :
                              'projectGalleryThumb'
                          }
                          onClick={() => setActiveGalleryIndex(index)}
                          aria-label={`Show image ${index + 1}: ${item.alt}`}
                        >
                          <GatsbyImage
                            image={thumbImage}
                            alt={item.alt}
                            className="projectGalleryThumbImage"
                            imgStyle={{objectFit: 'cover', objectPosition: 'top center'}}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="projectGalleryViewer">
                    <button
                      type="button"
                      className="projectGalleryActive"
                      onClick={() => setIsGalleryModalOpen(true)}
                    >
                      <GatsbyImage
                        image={activeGalleryImage}
                        alt={activeGalleryItem.alt}
                        className="projectGalleryActiveImage"
                        imgStyle={{objectFit: 'contain', objectPosition: 'top center'}}
                      />
                    </button>
                    <div className="projectGalleryViewerFooter">
                      {activeGalleryItem.caption ? (
                        <p className="projectGalleryCaption">
                          {activeGalleryItem.caption}
                        </p>
                      ) : <span />}
                      <button
                        type="button"
                        className="projectGalleryZoomButton"
                        onClick={() => setIsGalleryModalOpen(true)}
                      >
                        Zoom image
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="projectBody box">
              <div className="content projectBodyContent">
                {children}
              </div>
            </section>
          </div>

          <aside className="projectAside">
            <div className="projectMetaCard box">
              {language && (
                <div className="projectMetaItem">
                  <span className="projectMetaLabel">Language</span>
                  <span className="projectMetaValue">{language}</span>
                </div>
              )}
              {repo && (
                <div className="projectMetaItem">
                  <span className="projectMetaLabel">Repository</span>
                  <a href={repo} target="_blank" rel="noopener noreferrer">
                    View on GitHub
                  </a>
                </div>
              )}
              {demo && (
                <div className="projectMetaItem">
                  <span className="projectMetaLabel">Demo</span>
                  <a href={demo} target="_blank" rel="noopener noreferrer">
                    Open project
                  </a>
                </div>
              )}
              {tags && tags.length ? (
                <div className="projectMetaItem">
                  <span className="projectMetaLabel">Tags</span>
                  <div className="projectTagList">
                    {tags.map((tag) => (
                      <span className="projectTag" key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
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
