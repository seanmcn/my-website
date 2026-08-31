import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import SeriesNavigator from '../components/item/seriesNavigator';
import {
  ArrowLeftIcon,
  CalendarIcon,
  CategoryIcon,
  ClockIcon,
  ReplyIcon,
} from '../components/icons/icons';
import useCondensedHeader from '../hooks/useCondensedHeader';
import {
  categoryPath,
  formatItemDate,
  itemPath,
  normaliseType,
  readTimeLabel,
  slugToTitle,
  sourceHost,
  typeMeta,
} from '../utils/content';
import './item.scss';

const TYPE_GLYPH = {post: '●', note: '◆', find: '■'};

const ItemPage = ({children, data, location, pageContext}) => {
  const {mdx: item} = data;
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const {
    headings = [],
    nextInSeries = null,
    previousInSeries = null,
    relatedPosts = [],
    seriesCount = 0,
    seriesIndex = null,
    seriesPosts = [],
    seriesTitle = null,
  } = pageContext;

  const condensed = useCondensedHeader();
  const type = normaliseType(item.fields?.itemType);
  const meta = typeMeta(type);
  const {frontmatter} = item;
  const isFind = type === 'find';
  const featured = getImage(frontmatter.featured);
  const margins = frontmatter.margins || [];
  const readTime = readTimeLabel(item.fields?.readingTime);
  const host = sourceHost(frontmatter.source);
  const showToc = headings.length > 2;
  const pageTitle = `${frontmatter.title} - ${siteTitle}`;

  return (
    <Layout>
      <RuntimeSeoSync
        description={frontmatter.summary || item.excerpt}
        pathname={location?.pathname || itemPath(frontmatter.slug)}
        siteUrl={siteUrl}
        title={pageTitle}
      />
      <div className="pageWrap itemPage" data-type={type}>
        <article className="itemPage__article" id="postMainColumn">
          <div className={`itemBar ${condensed ? 'is-condensed' : ''}`}>
            <Link className="itemBar__back" to="/library/">
              <ArrowLeftIcon />
              Library
            </Link>
            <h1 className="itemBar__title">{frontmatter.title}</h1>
            <span className="itemBar__date">
              <CalendarIcon />
              {formatItemDate(frontmatter.date)}
            </span>
          </div>

          <div className={`itemPage__body ${
            isFind || type === 'note' ? 'itemPage__body--narrow' : ''
          }`}>
            {/* On mobile the margin notes have nowhere to go, so they lead. */}
            {margins.length > 0 && (
              <div className="itemPage__inlineMargins">
                {margins.map(margin => (
                  <div key={margin.label}>
                    <div className="itemPage__marginLabel">{margin.label}</div>
                    <p className="itemPage__marginText">{margin.text}</p>
                  </div>
                ))}
              </div>
            )}

            {isFind && frontmatter.source && (
              <a
                className="itemPage__source"
                href={frontmatter.source}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="itemPage__sourceLabel">Source</span>
                <span className="itemPage__sourceLink">
                  {frontmatter.sourceTitle || host}
                  <span aria-hidden="true">↗</span>
                </span>
              </a>
            )}

            <SeriesNavigator
              currentSlug={frontmatter.slug}
              nextInSeries={nextInSeries}
              previousInSeries={previousInSeries}
              seriesCount={seriesCount}
              seriesIndex={seriesIndex}
              seriesPosts={seriesPosts}
              seriesTitle={seriesTitle}
            />

            <div className="prose">
              {featured && (
                <figure className="prose__floatFigure">
                  <GatsbyImage
                    alt={frontmatter.title}
                    className="featuredImage"
                    image={featured}
                  />
                </figure>
              )}
              {children}
            </div>
          </div>

          <div className="itemPage__end">
            <div className="itemPage__ornament">
              <span className="itemPage__rule" />
              <span className="itemPage__diamond" />
              <span className="itemPage__rule" />
            </div>
            <div className="itemPage__endRow">
              <span className="itemPage__endLeft">
                {frontmatter.category && (
                  <Link
                    className="itemPage__categoryLink"
                    to={categoryPath(frontmatter.category)}
                  >
                    <CategoryIcon size={13} />
                    {slugToTitle(frontmatter.category)}
                  </Link>
                )}
              </span>
              <span className="itemPage__kind">
                <span
                  className={`typeDot typeDot--${type}`}
                  style={{background: meta.colour}}
                />
                {meta.label}
              </span>
              <span className="itemPage__endRight">
                <Link to={`/contact/?about=${frontmatter.slug}`}>
                  <ReplyIcon size={13} />
                  Get in touch about this →
                </Link>
              </span>
            </div>
          </div>

          {frontmatter.tags && frontmatter.tags.length > 0 && (
            <div className="itemPage__tags">
              {frontmatter.tags.map(tag => (
                <Link
                  className="itemPage__tag"
                  key={tag}
                  to={`/library/tags/${tag}/`}
                >
                  {slugToTitle(tag)}
                </Link>
              ))}
            </div>
          )}
        </article>

        <aside className="itemRail" id="postSidebarColumn">
          {margins.length > 0 && (
            <div className="itemRail__margins">
              {margins.map(margin => (
                <div key={margin.label}>
                  <div className="railBlock__label">{margin.label}</div>
                  <p className="itemRail__marginText">{margin.text}</p>
                </div>
              ))}
            </div>
          )}

          {!isFind && readTime && (
            <div>
              <div className="railBlock__label">Read time</div>
              <div className="itemRail__readTime">
                <ClockIcon size={13} />
                {readTime}
              </div>
            </div>
          )}

          {isFind && host && (
            <div>
              <div className="railBlock__label">Source</div>
              <div className="itemRail__readTime">
                <a
                  href={frontmatter.source}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {host} ↗
                </a>
              </div>
            </div>
          )}

          {showToc && (
            <div className="railBlock">
              <div className="railBlock__label">On this page</div>
              {headings.map(heading => (
                <a
                  className="itemRail__tocLink"
                  href={heading.href}
                  key={heading.href}
                >
                  {heading.text}
                </a>
              ))}
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="railBlock">
              <div className="railBlock__label">Related</div>
              {relatedPosts.map(related => (
                <Link
                  className="itemRail__related"
                  key={related.slug}
                  to={itemPath(related.slug)}
                >
                  <span
                    className="itemRail__glyph"
                    style={{
                      color: typeMeta(related.type).colour,
                    }}
                  >
                    {TYPE_GLYPH[normaliseType(related.type)]}
                  </span>
                  <span>{related.title}</span>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </Layout>
  );
};

ItemPage.propTypes = {
  children: PropTypes.node,
  data: PropTypes.object.isRequired,
  location: PropTypes.object,
  pageContext: PropTypes.object.isRequired,
};

export default ItemPage;

export const pageQuery = graphql`
  query ItemBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
        author
      }
    }
    mdx(frontmatter: {slug: {eq: $slug}}) {
      id
      excerpt(pruneLength: 190)
      fields {
        itemType
        readingTime
      }
      frontmatter {
        title
        slug
        date
        category
        tags
        summary
        source
        sourceTitle
        margins {
          label
          text
        }
        featured {
          childImageSharp {
            gatsbyImageData(
              width: 720
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`;

export const Head = ({data, location}) => {
  const {mdx: item} = data;
  const {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
  } = data.site.siteMetadata;
  const title = `${item.frontmatter.title} - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        description={item.frontmatter.summary || item.excerpt}
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
        type="article"
      />
    </>
  );
};
