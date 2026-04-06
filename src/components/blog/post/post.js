import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import './post.scss';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {slugToTitle} from '../../../utils/blog';

function SeriesNavigator({
  currentSlug,
  nextInSeries,
  previousInSeries,
  seriesCount,
  seriesIndex,
  seriesPosts,
  seriesTitle,
}) {
  if (!seriesCount || seriesCount < 2 || !seriesTitle || !seriesPosts.length) {
    return null;
  }

  const displayTitle = slugToTitle(seriesTitle);

  return (
    <section className="seriesNavigator" aria-label={`${displayTitle} series`}>
      <div className="seriesNavigatorHeader">
        <p className="seriesNavigatorEyebrow">Series</p>
        <h2 className="seriesNavigatorTitle">
          Part {seriesIndex} of {seriesCount} in {displayTitle}
        </h2>
      </div>
      <ol className="seriesNavigatorList">
        {seriesPosts.map((post, index) => {
          const isCurrentPost = post.slug === currentSlug;

          return (
            <li
              className={
                `seriesNavigatorItem ${isCurrentPost ? 'is-current' : ''}`
              }
              key={post.slug}>
              <span className="seriesNavigatorOrder">
                Part {post.seriesOrder || index + 1}
              </span>
              {isCurrentPost ? (
                <span className="seriesNavigatorCurrent" aria-current="true">
                  {post.title}
                </span>
              ) : (
                <Link
                  className="seriesNavigatorLink"
                  to={`/blog/${post.slug}/`}>
                  {post.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
      <div className="seriesNavigatorFooter">
        {previousInSeries ? (
          <Link
            className="seriesNavigatorDirection"
            rel="prev"
            to={`/blog/${previousInSeries.slug}/`}>
            Previous: {previousInSeries.title}
          </Link>
        ) : (
          <span className="seriesNavigatorDirection is-disabled">
            This is the first part
          </span>
        )}
        {nextInSeries ? (
          <Link
            className="seriesNavigatorDirection seriesNavigatorDirection--next"
            rel="next"
            to={`/blog/${nextInSeries.slug}/`}>
            Next: {nextInSeries.title}
          </Link>
        ) : (
          <span className="seriesNavigatorDirection is-disabled">
            This is the latest part
          </span>
        )}
      </div>
    </section>
  );
}

function Post({
  id,
  slug,
  title,
  content,
  date,
  category,
  tags,
  featured,
  seriesTitle,
  seriesCount,
  seriesIndex,
  seriesPosts,
  previousInSeries,
  nextInSeries,
}) {
  const image = getImage(featured);
  return (<div className="box blog-post-box" key={id}>
    <div>
      <div className="blog-post-badges">
        {category && (
          <div className="blog-post-category-badge">
            <Link to={`/blog/categories/${category}/`}>
              {slugToTitle(category)}
            </Link>
          </div>
        )}
        <div className="blog-post-date-badge">
          <span className="icon-text">
            <span className="icon">
              <FontAwesomeIcon icon={icon({name: 'calendar'})} />
            </span>
            <span>{date}</span>
          </span>
        </div>
      </div>
      <Link
        className="has-text-primary blog-post-title-link"
        to={`/blog/${slug}/`}>
        <h1 className="title blog-post-title">{title}</h1>
      </Link>
      <div className="content blog-post-content">
        <SeriesNavigator
          currentSlug={slug}
          nextInSeries={nextInSeries}
          previousInSeries={previousInSeries}
          seriesCount={seriesCount}
          seriesIndex={seriesIndex}
          seriesPosts={seriesPosts}
          seriesTitle={seriesTitle}
        />
        {featured && (
          <GatsbyImage image={image} alt={title} className={'featuredImage'}/>
        )}
        {content}
        <hr/>
        <div className="blog-post-footer">
          {tags && tags.length ? (
              <div className="blog-post-tags">
                {tags.map(tag => (
                  <span key={`${tag}tag`} className="blog-post-tag-chip">
                    <Link to={`/blog/tags/${tag}/`}>{slugToTitle(tag)}</Link>
                  </span>
                ))}
              </div>
            ) : null}
        </div>
      </div>
    </div>
  </div>
  );
};

SeriesNavigator.propTypes = {
  currentSlug: PropTypes.string.isRequired,
  nextInSeries: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  previousInSeries: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  seriesCount: PropTypes.number,
  seriesIndex: PropTypes.number,
  seriesPosts: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    seriesOrder: PropTypes.number,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  seriesTitle: PropTypes.string,
};

SeriesNavigator.defaultProps = {
  nextInSeries: null,
  previousInSeries: null,
  seriesCount: 0,
  seriesIndex: null,
  seriesPosts: [],
  seriesTitle: null,
};

Post.propTypes = {
  category: PropTypes.string,
  content: PropTypes.node.isRequired,
  date: PropTypes.string,
  featured: PropTypes.any,
  id: PropTypes.string.isRequired,
  nextInSeries: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  previousInSeries: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  seriesCount: PropTypes.number,
  seriesIndex: PropTypes.number,
  seriesPosts: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    seriesOrder: PropTypes.number,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  seriesTitle: PropTypes.string,
  slug: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
};

Post.defaultProps = {
  category: null,
  date: null,
  featured: null,
  nextInSeries: null,
  previousInSeries: null,
  seriesCount: 0,
  seriesIndex: null,
  seriesPosts: [],
  seriesTitle: null,
  tags: [],
};

export default Post;
