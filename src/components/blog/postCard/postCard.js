import React from 'react';
import {Link} from 'gatsby';
import './postCard.scss';
import {GatsbyImage, getImage} from 'gatsby-plugin-image';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {slugToTitle} from '../../../utils/blog';

function PostCard({
  id, slug, title, date, category, cover,
}) {
  const image = getImage(cover);
  return (
    <div className="box postCardBox" key={id}>
      <div className="postCardDateBadge">
        <span className="icon-text">
          <span className="icon">
            <FontAwesomeIcon icon={icon({name: 'calendar'})} />
          </span>
          <span>{date}</span>
        </span>
      </div>

      <div className="postCardBody">
        {category && (
          <div className="postCardCategoryRow">
            <span className="postCardCategory">
              <Link to={`/blog/categories/${category}/`}>
                {slugToTitle(category)}
              </Link>
            </span>
          </div>
        )}

        <Link className="has-text-primary postCardTitleLink"
          to={`/blog/${slug}/`}>
          <h1 className="title postCardTitle">{title}</h1>
        </Link>

        {cover && (
          <Link className="postCardImageLink" to={`/blog/${slug}/`}>
            <GatsbyImage image={image} alt={title} className="postCardImage"/>
          </Link>
        )}

      </div>

    </div>);
}

export default PostCard;
