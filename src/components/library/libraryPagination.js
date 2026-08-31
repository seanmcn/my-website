import React from 'react';
import PropTypes from 'prop-types';
import {Link, navigate} from 'gatsby';

/*
 * Previous / page indicator / next, with the page number itself acting as a
 * disclosure for the full jump grid. Keeps the long tail of the archive
 * reachable without printing nine numbers under every listing.
 */
const LibraryPagination = ({pageContext}) => {
  const [jumpOpen, setJumpOpen] = React.useState(false);
  const {
    humanPageNumber: page = 1,
    nextPagePath,
    numberOfPages: total = 1,
    paginate_link: base,
    previousPagePath,
  } = pageContext;

  if (!total || total < 2) {
    return null;
  }

  const pagePath = number =>
    (number === 1 ? `${base}/` : `${base}/page/${number}/`);

  return (
    <nav aria-label="Pagination" className="libraryPagination">
      <div className="libraryPagination__row">
        {previousPagePath ? (
          <Link
            className="libraryPagination__step"
            rel="prev"
            to={previousPagePath}
          >
            ‹ Previous
          </Link>
        ) : (
          <span className="libraryPagination__step is-disabled">
            ‹ Previous
          </span>
        )}

        <button
          aria-expanded={jumpOpen}
          className={
            `libraryPagination__status ${jumpOpen ? 'is-open' : ''}`
          }
          onClick={() => setJumpOpen(open => !open)}
          type="button"
        >
          Page {page} of {total}
        </button>

        {nextPagePath ? (
          <Link
            className="libraryPagination__step"
            rel="next"
            to={nextPagePath}
          >
            Next ›
          </Link>
        ) : (
          <span className="libraryPagination__step is-disabled">Next ›</span>
        )}
      </div>

      {jumpOpen && (
        <div className="libraryPagination__jump">
          {Array.from({length: total}, (_, index) => index + 1).map(number => (
            <button
              aria-label={`Go to page ${number}`}
              className={`libraryPagination__page ${
                number === page ? 'is-current' : ''
              }`}
              key={number}
              onClick={() => {
                setJumpOpen(false);
                navigate(pagePath(number));
              }}
              type="button"
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

LibraryPagination.propTypes = {
  pageContext: PropTypes.shape({
    humanPageNumber: PropTypes.number,
    nextPagePath: PropTypes.string,
    numberOfPages: PropTypes.number,
    paginate_link: PropTypes.string,
    previousPagePath: PropTypes.string,
  }).isRequired,
};

export default LibraryPagination;
