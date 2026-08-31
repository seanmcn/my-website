import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {itemPath, slugToTitle} from '../../utils/content';
import './seriesNavigator.scss';

/*
 * Shown on the multi-part posts (the RTS game series, mostly). Keeps its place
 * above the article body so a reader arriving at part three knows straight
 * away that parts one and two exist.
 */
const SeriesNavigator = ({
  currentSlug,
  nextInSeries,
  previousInSeries,
  seriesCount,
  seriesIndex,
  seriesPosts,
  seriesTitle,
}) => {
  if (!seriesCount || seriesCount < 2 || !seriesTitle || !seriesPosts.length) {
    return null;
  }

  const displayTitle = slugToTitle(seriesTitle);

  return (
    <section className="series" aria-label={`${displayTitle} series`}>
      <div className="series__eyebrow">Series</div>
      <h2 className="series__title">
        Part {seriesIndex} of {seriesCount} in {displayTitle}
      </h2>
      <ol className="series__list">
        {seriesPosts.map((post, index) => {
          const isCurrent = post.slug === currentSlug;

          return (
            <li
              className={`series__item ${isCurrent ? 'is-current' : ''}`}
              key={post.slug}
            >
              <span className="series__order">
                Part {post.seriesOrder || index + 1}
              </span>
              {isCurrent ? (
                <span aria-current="true">{post.title}</span>
              ) : (
                <Link to={itemPath(post.slug)}>{post.title}</Link>
              )}
            </li>
          );
        })}
      </ol>
      <div className="series__footer">
        {previousInSeries ? (
          <Link rel="prev" to={itemPath(previousInSeries.slug)}>
            ‹ {previousInSeries.title}
          </Link>
        ) : (
          <span className="is-disabled">This is the first part</span>
        )}
        {nextInSeries ? (
          <Link rel="next" to={itemPath(nextInSeries.slug)}>
            {nextInSeries.title} ›
          </Link>
        ) : (
          <span className="is-disabled">This is the latest part</span>
        )}
      </div>
    </section>
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

export default SeriesNavigator;
