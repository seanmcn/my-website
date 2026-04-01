import React from 'react';
import PropTypes from 'prop-types';
import SearchResult from './searchResult';

const SearchResults = ({
  results,
  query,
  loadingIndex,
  browseCategories,
  facetGroups,
  activeFilter,
  onSelectBrowse,
  onSelectFilter,
  clearFilter,
}) => {
  if (loadingIndex) {
    return (
      <div className="searchResultsEmptyState">
        Building the search index for this session.
      </div>
    );
  }

  if (!query) {
    return (
      <div className="searchResultsEmptyState">
        <p>Start typing to search across blog posts.</p>
        <div className="searchBrowseGroup">
          <span className="searchBrowseLabel">Browse popular categories</span>
          <div className="searchFilterList">
            {browseCategories.map(category => (
              <button
                className="searchFilterChip searchFilterChipBrowse"
                key={category.value}
                onClick={() => onSelectBrowse(category.label)}
                type="button"
              >
                {category.label} <span>{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {(facetGroups.categories.length > 0 || facetGroups.tags.length > 0) && (
        <div className="searchFilters">
          <div className="searchFilterList">
            {facetGroups.categories.slice(0, 5).map(filter => (
              <button
                className={`searchFilterChip ${activeFilter &&
                activeFilter.type === filter.type &&
                activeFilter.value === filter.value ? 'is-active' : ''}`}
                key={`${filter.type}-${filter.value}`}
                onClick={() => onSelectFilter(filter)}
                type="button"
              >
                {filter.label} <span>{filter.count}</span>
              </button>
            ))}
            {facetGroups.tags.slice(0, 6).map(filter => (
              <button
                className={`searchFilterChip ${activeFilter &&
                activeFilter.type === filter.type &&
                activeFilter.value === filter.value ? 'is-active' : ''}`}
                key={`${filter.type}-${filter.value}`}
                onClick={() => onSelectFilter(filter)}
                type="button"
              >
                #{filter.label} <span>{filter.count}</span>
              </button>
            ))}
            {activeFilter && (
              <button
                className="searchFilterChip searchFilterChipClear"
                onClick={clearFilter}
                type="button"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}
      <div className="searchResults-list">
        {results.map(result => (
          <SearchResult key={result.item.slug} result={result} />
        ))}
        {results.length === 0 && (
          <p className="searchResults-empty">
            No results found for this query. Try a broader keyword or clear the
            active filter.
          </p>
        )}
      </div>
    </>
  );
};

SearchResults.propTypes = {
  activeFilter: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.string,
  }),
  browseCategories: PropTypes.array.isRequired,
  clearFilter: PropTypes.func.isRequired,
  facetGroups: PropTypes.shape({
    categories: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
  }).isRequired,
  loadingIndex: PropTypes.bool.isRequired,
  onSelectBrowse: PropTypes.func.isRequired,
  onSelectFilter: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  results: PropTypes.array.isRequired,
};

export default SearchResults;
