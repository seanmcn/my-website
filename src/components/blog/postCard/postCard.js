import React from 'react';
import {Link} from 'gatsby';
import {MDXRenderer} from 'gatsby-plugin-mdx';
import './postCard.scss';

const PostCard = ({
  id, slug, title, content, date, tags,
}) => (
  <div className="box postCardBox" key={id}>
    <Link className="has-text-primary" to={`/blog/${slug}/`}>
      <h1 className="title">{title}</h1>
    </Link>
    <div className="postCardContent">
      {tags && tags.length ? (
        <div className="tags postCardTags">
          {tags.map(tag => (
            <span key={`${tag}tag`} className="tag">
              <Link to={`/blog/tags/${tag}/`}>{tag}</Link>
            </span>
          ))}
        </div>
      ) : null}
      <div className="postedOn">
        {date}
      </div>
    </div>

  </div>
);

export default PostCard;
