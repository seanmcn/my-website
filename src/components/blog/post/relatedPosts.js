import React from 'react';
import {Link} from 'gatsby';
import {slugToTitle} from '../../../utils/blog';
import './relatedPostLink.scss';

const RelatedPosts = ({
  relatedPosts,
}) => (
  <div className="box relatedPostsBox">
    <nav className="relatedPosts">
      <div className="relatedPostsHeader">
        <h2 className="subtitle relatedPostsTitle">Related Posts</h2>
      </div>
      <div className="relatedPostsList">
        {relatedPosts.map(x => (
          <Link
            className="relatedPost relatedPostItem"
            key={`container_${x.slug}`}
            to={`/blog/${x.slug}/`}>
            {x.date && (
              <span className="relatedPostDateBadge">{x.date}</span>
            )}
            <span className="relatedPostLink">
              {x.title}
            </span>
            {x.excerpt && (
              <p className="relatedPostExcerpt">{x.excerpt}</p>
            )}
            <div className="tags">
              {x.reason && (
                <span className="tag is-primary is-light">{x.reason}</span>
              )}
              {x.tags && x.tags.slice(0, 2).map(tag => (
                <span className="tag" key={`${x.slug}-${tag}`}>
                  {slugToTitle(tag)}
                </span>
              ))}
            </div>
            {x.category && (
              <span className="relatedPostCategoryBadge">
                {slugToTitle(x.category)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  </div>
);

export default RelatedPosts;
