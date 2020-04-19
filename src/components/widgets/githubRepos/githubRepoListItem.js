import React from 'react'
import '../../blog/post/post.scss'
import PropTypes from 'prop-types'

const GithubRepoListItem = ({ id, link, description, title, icons }) => (
  <li key={id}>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={description}
      title={description}
      key={title}
    >
      {title}
    </a>
    {icons.map(icon => {
      return <i className={`fab ${icon}`} key={icon} />
    })}
    <p className="description">{description}</p>
  </li>
)

GithubRepoListItem.propTypes = {
  id: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icons: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default GithubRepoListItem
