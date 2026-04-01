import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'gatsby';
import {slugToTitle} from '../../utils/blog';

function renderHighlightedText(text, indices) {
  if (!text || !indices || indices.length === 0) {
    return text;
  }

  const highlightedText = [];
  let cursor = 0;

  indices.forEach(([start, end]) => {
    if (start > cursor) {
      highlightedText.push(text.slice(cursor, start));
    }

    highlightedText.push(
        <mark key={`${start}-${end}`} className="searchResultHighlight">
          {text.slice(start, end + 1)}
        </mark>,
    );
    cursor = end + 1;
  });

  if (cursor < text.length) {
    highlightedText.push(text.slice(cursor));
  }

  return highlightedText;
}

function getMatchIndices(matches = [], key) {
  return matches
      .filter(match => match.key === key)
      .flatMap(match => match.indices);
}

const SearchResult = ({result}) => {
  const {item, matches = []} = result;
  const titleMatches = getMatchIndices(matches, 'title');
  const excerptMatches = getMatchIndices(matches, 'excerpt');

  return (
    <Link className="searchResult-item" to={item.path || `/blog/${item.slug}/`}>
      {item.date && (
        <span className="searchResultDateBadge">{item.date}</span>
      )}
      <h4 className="searchResult-title">
        {renderHighlightedText(item.title, titleMatches)}
      </h4>
      <div className="searchResult-excerpt">
        {renderHighlightedText(item.excerpt, excerptMatches)}
      </div>
      <div className="searchResultTags">
        {(item.tags || []).slice(0, 3).map(tag => (
          <span className="searchResultTag" key={`${item.slug}-${tag}`}>
            {tag}
          </span>
        ))}
      </div>
      {item.category && (
        <span className="searchResultCategoryBadge">
          {slugToTitle(item.category)}
        </span>
      )}
    </Link>
  );
};

SearchResult.propTypes = {
  result: PropTypes.shape({
    item: PropTypes.shape({
      category: PropTypes.string,
      date: PropTypes.string,
      excerpt: PropTypes.string,
      path: PropTypes.string,
      slug: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      title: PropTypes.string.isRequired,
    }).isRequired,
    matches: PropTypes.array,
  }).isRequired,
};

export default SearchResult;
