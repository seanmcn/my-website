import React from 'react';
import { Link } from 'gatsby';
import './breadcrumbs.scss';
import { slugToTitle } from '../../../utils/blog';

const Breadcrumbs = ({ category, title, slug }) => (
  <div>
    <nav
      className="breadcrumb is-small has-succeeds-separator"
      aria-label="breadcrumbs"
    >
      <ul>
        <li key="/blog/">
          <Link to="/blog">Blog</Link>
        </li>
        <li key={`/blog/categories/${category}`}>
          <Link to={`/blog/categories/${category}`}>
            {slugToTitle(category)}
          </Link>
        </li>
        <li key={`/blog/${slug}`} className="is-active">
          <Link
            to={`/blog/${slug}`}
            aria-current="page"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </li>
      </ul>
    </nav>
  </div>
);

export default Breadcrumbs;
