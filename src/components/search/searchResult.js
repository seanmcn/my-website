import React from 'react';
import {Link} from 'gatsby';

const SearchResult = ({hit}) => (
  <div className="searchResult-item">
    <Link to={`/blog/${hit.slug}/`}>
      <h4>{hit.title}</h4>
    </Link>
    <div className="searchResult-excerpt">{hit.excerpt}</div>
  </div>
);

export default SearchResult;
