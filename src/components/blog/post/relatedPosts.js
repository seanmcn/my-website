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
        {relatedPosts.posts.slice(0, 3).map(x => (
          <Link
            className="relatedPostItem"
            key={`container_${x.frontmatter.slug}`}
            to={`/blog/${x.frontmatter.slug}`}>
            {x.frontmatter.date && (
              <span className="relatedPostDateBadge">{x.frontmatter.date}</span>
            )}
            <span className="relatedPostLink">
              {x.frontmatter.title}
            </span>
            {x.excerpt && (
              <p className="relatedPostExcerpt">{x.excerpt}</p>
            )}
            {x.frontmatter.category && (
              <span className="relatedPostCategoryBadge">
                {slugToTitle(x.frontmatter.category)}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  </div>
);

export default RelatedPosts;
