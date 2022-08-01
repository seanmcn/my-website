import React from 'react';
import {Link} from 'gatsby';
import {Highlight} from 'react-instantsearch-dom';

const SearchResult = ({hit}) => (
  <div key={hit.objectID}>
    <Link to={`/blog/${hit.slug}/`}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="strong" />
      </h4>
    </Link>
    <div>
      <Highlight attribute="excerpt" hit={hit} tagName="strong" />
    </div>
  </div>
);

export default SearchResult;
