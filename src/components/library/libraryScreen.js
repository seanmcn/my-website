import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import ItemRow from './itemRow';
import LibraryFilters from './libraryFilters';
import LibraryPagination from './libraryPagination';
import LibraryRail from './libraryRail';

/*
 * The library index, its per-type views and both taxonomy listings are the
 * same screen with a different rail selection and a different set of rows, so
 * they share one component.
 */
const LibraryScreen = ({
  activeCategory,
  activeFilter,
  activeTag,
  blurb,
  items,
  pageContext,
  title,
  totalCount,
}) => {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const count = typeof totalCount === 'number' ? totalCount : items.length;
  const resultLine = `${count} ${count === 1 ? 'item' : 'items'}`;

  return (
    <div className="pageWrap">
      <div className="twoCol twoCol--padded">
        <div className="mobileIntro">
          <div className="libraryRail__eyebrow">
            {title} &middot; {count}
          </div>
          <p>{blurb}</p>
        </div>
        <button
          aria-expanded={filtersOpen}
          className={`railToggle ${filtersOpen ? 'is-open' : ''}`}
          onClick={() => setFiltersOpen(open => !open)}
          type="button"
        >
          {filtersOpen ? 'Hide filters ✕' : 'Filters ▾'}
        </button>

        <LibraryRail
          activeCategory={activeCategory}
          activeTag={activeTag}
          blurb={blurb}
          count={count}
          open={filtersOpen}
          title={title}
        />

        <div>
          <LibraryFilters active={activeFilter} resultLine={resultLine} />

          {items.map(item => (
            <ItemRow item={item} key={item.id} />
          ))}

          {items.length === 0 && (
            <div className="libraryEmpty">
              <div className="libraryEmpty__title">Nothing here yet</div>
              <p className="libraryEmpty__body">
                No items match that combination of filters.
              </p>
              <Link className="libraryEmpty__action" to="/library/">
                Clear filters ✕
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <LibraryPagination pageContext={pageContext} />
          )}
        </div>
      </div>
    </div>
  );
};

LibraryScreen.propTypes = {
  activeCategory: PropTypes.string,
  activeFilter: PropTypes.string,
  activeTag: PropTypes.string,
  blurb: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  pageContext: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  totalCount: PropTypes.number,
};

LibraryScreen.defaultProps = {
  activeCategory: null,
  activeFilter: 'all',
  activeTag: null,
  blurb: '',
  totalCount: null,
};

export default LibraryScreen;
