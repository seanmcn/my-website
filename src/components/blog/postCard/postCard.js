import React from 'react';
import {Link} from 'gatsby';
import './postCard.scss';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function PostCard({
  id, slug, title, date, tags, cover,
}) {
  const image = getImage(cover);
  return (
    <div className="box postCardBox" key={id}>
      <Link className="has-text-primary" to={`/blog/${slug}/`}>
        <h1 className="title">{title}</h1>
      </Link>
      <div className="postedOn">
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={icon({name: 'calendar'})} />
          </span>
          <span>{date}</span>
        </span>
      </div>
      {cover && (
        <Link to={`/blog/${slug}/`}>
          <GatsbyImage image={image} alt={title}/>
        </Link>
      )}
      {tags && tags.length ? (
        <div className="postCardTags">
          {tags.map(tag => (
            <span key={`${tag}tag`} className="tag">
              <Link to={`/blog/tags/${tag}/`}>{tag}</Link>
            </span>
          ))}
        </div>
      ) : null}

    </div>);
}

export default PostCard;
