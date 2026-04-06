import React from 'react';
import {Link} from 'gatsby';
import './post.scss';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {slugToTitle} from '../../../utils/blog';

function Post({
  id, slug, title, content, date, category, tags, featured,
}) {
  const image = getImage(featured);
  return (<div className="box blog-post-box" key={id}>
    <div>
      <div className="blog-post-badges">
        {category && (
          <div className="blog-post-category-badge">
            <Link to={`/blog/categories/${category}/`}>
              {slugToTitle(category)}
            </Link>
          </div>
        )}
        <div className="blog-post-date-badge">
          <span className="icon-text">
            <span className="icon">
              <FontAwesomeIcon icon={icon({name: 'calendar'})} />
            </span>
            <span>{date}</span>
          </span>
        </div>
      </div>
      <Link
        className="has-text-primary blog-post-title-link"
        to={`/blog/${slug}/`}>
        <h1 className="title blog-post-title">{title}</h1>
      </Link>
      <div className="content blog-post-content">
        {featured && (
          <GatsbyImage image={image} alt={title} className={'featuredImage'}/>
        )}
        {content}
        <hr/>
        <div className="blog-post-footer">
          {tags && tags.length ? (
              <div className="blog-post-tags">
                {tags.map(tag => (
                  <span key={`${tag}tag`} className="blog-post-tag-chip">
                    <Link to={`/blog/tags/${tag}/`}>{slugToTitle(tag)}</Link>
                  </span>
                ))}
              </div>
            ) : null}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Post;
