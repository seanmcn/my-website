import React from 'react'
import PropTypes from 'prop-types'
import GithubReposWidget from '../widgets/githubRepos/githubRepos'
import LatestPostsWidget from '../widgets/latestPosts/latestPosts'

const Sidebar = () => (
  <div>
    <GithubReposWidget />
    <LatestPostsWidget />
  </div>
)

Sidebar.propTypes = {
  relatedPosts: PropTypes.arrayOf(PropTypes.object),
}

export default Sidebar
