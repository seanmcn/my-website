import React from 'react';
import { connectStateResults, InfiniteHits } from 'react-instantsearch-dom';
import SearchResult from './searchResult';

const SearchResults = connectStateResults(({ searchState }) =>
  searchState && searchState.query ? (
    <div>
      <InfiniteHits hitComponent={SearchResult} />
    </div>
  ) : (
    <div />
  )
);

export default SearchResults;