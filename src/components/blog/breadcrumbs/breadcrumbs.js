import React from 'react'
import { Link } from 'gatsby'
import './breadcrumbs.scss'

const Breadcrumbs = ({ categories, title, slug }) => (
  <div>
    <nav
      className="breadcrumb is-small has-succeeds-separator"
      aria-label="breadcrumbs"
    >
      <ul>
        <li key="/blog/">
          <Link to="/blog">Blog</Link>
        </li>
        {categories.map(category => (
          <li key={`/blog/categories/${category.slug}`}>
            <Link to={`/blog/categories/${category.slug}`}>{category.name}</Link>
          </li>
        ))}
        <li key={`/blog/${slug}`} className="is-active">
          <Link to={`/blog/${slug}`} aria-current="page">
            {title}
          </Link>
        </li>
      </ul>
    </nav>
  </div>
)

export default Breadcrumbs
