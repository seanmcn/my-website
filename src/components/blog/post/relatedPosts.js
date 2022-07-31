import React from 'react';
import { Link } from 'gatsby';
import { slugToTitle } from '../../../utils/blog';
import './relatedPostLink.scss';

const RelatedPosts = ({
  relatedPosts,
}) => (
  <div className="box">
    <nav>
      <h2 className="subtitle">Related Posts</h2>
      <div className="content">
        {relatedPosts.posts.slice(0, 5).map(x => (
          <div className="relatedPost">
            <div className="relatedPostContainer">
              <Link
                to={`/blog/${x.frontmatter.slug}`}
              >
                {x.frontmatter.title}
              </Link>
              <div className="tags has-addons">
                {x.frontmatter.tags.map(tag => (
                  <Link
                    to={`/blog/tags/${tag}`}
                    aria-label={`Links to posts in tag ${slugToTitle(tag)}`}
                    key={tag}
                  >
                    <span className="tag" aria-label="Tag name">
                      {slugToTitle(tag)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  </div>
);

export default RelatedPosts;
