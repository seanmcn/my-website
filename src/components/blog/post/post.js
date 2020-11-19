import React from 'react';
import { Link } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import './post.scss';

const Post = ({
  id, slug, title, content, date, tags,
}) => (
  <div className="box" key={id}>
    <div>
      <Link className="has-text-primary" to={`/blog/${slug}/`}>
        <h1 className="title">{title}</h1>
      </Link>
      <div className="content">
        <MDXRenderer>{content}</MDXRenderer>
        <hr />
        <div className="is-grouped">
          <p className="subtitle is-7 is-pulled-right">
            Posted on&nbsp;
            {date}
          </p>
          {tags && tags.length ? (
            <div className="tags">
              {tags.map((tag) => (
                <span key={`${tag}tag`} className="tag">
                  <Link to={`/blog/tags/${tag}/`}>{tag}</Link>
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  </div>
);

export default Post;
