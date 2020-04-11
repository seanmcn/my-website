import React from 'react'
import { Link } from 'gatsby'
import './breadcrumbs.scss';

const Breadcrumbs = ({ categories, title, slug }) => (
  <div>
    <nav
      className="breadcrumb is-small has-succeeds-separator"
      aria-label="breadcrumbs"
    >
      <ul>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        {categories.map(category => (
          <li>
            <a href={`/blog/categories/${category.slug}`}>{category.name}</a>
          </li>
        ))}
        <li className="is-active">
          <Link to={`/blog/${slug}`} aria-current="page">
            {title}
          </Link>
        </li>
      </ul>
    </nav>
  </div>
)

export default Breadcrumbs
