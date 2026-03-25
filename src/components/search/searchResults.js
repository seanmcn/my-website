import React from 'react';
import SearchResult from './searchResult';

const SearchResults = ({results, query}) => {
  if (!query) return <div />;

  return (
    <div className="searchResults-list">
      {results.map((result) => (
        <SearchResult key={result.item.slug} hit={result.item} />
      ))}
      {results.length === 0 && (
        <p className="searchResults-empty">No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
