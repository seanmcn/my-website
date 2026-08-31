import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import useLibraryMeta from '../../hooks/useLibraryMeta';
import {LIBRARY_FILTERS} from '../../utils/content';

/*
 * The All / Posts / Notes / Finds bar. Each filter is a real route rather than
 * client state, so a filtered library is linkable and gets its own pagination.
 */
const LibraryFilters = ({active, resultLine}) => {
  const {counts} = useLibraryMeta();

  return (
    <div className="stickyBar libraryFilters">
      {LIBRARY_FILTERS.map(filter => (
        <Link
          className={`libraryFilters__link ${
            active === filter.key ? 'is-active' : ''
          }`}
          key={filter.key}
          to={filter.path}
        >
          {filter.key !== 'all' && (
            <span
              className={
                `libraryFilters__dot libraryFilters__dot--${filter.key}`
              }
              style={{background: `var(--${
                {post: 'plum', note: 'amber', find: 'blue'}[filter.key]
              })`}}
            />
          )}
          {filter.label}
          <span className="libraryFilters__count">
            {counts[filter.key] || 0}
          </span>
        </Link>
      ))}
      {resultLine && (
        <span className="libraryFilters__results">{resultLine}</span>
      )}
    </div>
  );
};

LibraryFilters.propTypes = {
  active: PropTypes.oneOf(['all', 'post', 'note', 'find']),
  resultLine: PropTypes.string,
};

LibraryFilters.defaultProps = {
  active: 'all',
  resultLine: '',
};

export default LibraryFilters;
