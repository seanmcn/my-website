import React from 'react';
import {Link} from 'gatsby';
import './breadcrumbs.scss';
import {slugToTitle} from '../../../utils/blog';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const Breadcrumbs = ({
  category, tag, title, slug,
}) => (
  <div>
    <nav
      className="breadcrumb is-small has-succeeds-separator"
      aria-label="breadcrumbs"
    >
      <ul>
        <li key="/blog/">
          <Link to="/blog">Blog</Link>
        </li>
        {category && (
          <li key={`/blog/categories/${category}`}>
            <Link to={`/blog/categories/${category}`}>
              {slugToTitle(category)}
            </Link>
          </li>
        )}
        {tag && (
          <li key={`/blog/tags/${tag}`}>
            <Link to={`/blog/tags/${tag}`}>
              <FontAwesomeIcon icon={icon({name: 'tag'})} />
              &nbsp;
              {slugToTitle(tag)}
            </Link>
          </li>
        )}
        {title && (
          <li key={`/blog/${slug}`} className="is-active">
            <Link
              to={`/blog/${slug}`}
              aria-current="page"
              dangerouslySetInnerHTML={{__html: title}}
            />
          </li>
        )}
      </ul>
    </nav>
  </div>
);

export default Breadcrumbs;
