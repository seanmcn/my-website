import React from 'react'
import { Link } from 'gatsby'
import '../../blog/post/post.scss'
import PropTypes from 'prop-types'

const LatestPostListItem = ({ id, slug, title }) => (
  <li key={id} className="list-item">
    <Link className="has-text-primary" to={`/blog/${slug}/`}>
      {title}
    </Link>
  </li>
)

LatestPostListItem.propTypes = {
  id: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default LatestPostListItem
