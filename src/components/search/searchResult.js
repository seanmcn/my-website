import React from 'react';
import {Link} from 'gatsby';
import {slugToTitle} from '../../utils/blog';

const SearchResult = ({hit}) => (
  <Link className="searchResult-item" to={`/blog/${hit.slug}/`}>
    {hit.date && (
      <span className="searchResultDateBadge">{hit.date}</span>
    )}
    <h4 className="searchResult-title">{hit.title}</h4>
    <div className="searchResult-excerpt">{hit.excerpt}</div>
    {hit.category && (
      <span className="searchResultCategoryBadge">
        {slugToTitle(hit.category)}
      </span>
    )}
  </Link>
);

export default SearchResult;
