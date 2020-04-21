import React from 'react'
import PropTypes from 'prop-types'
import AboutMeWidget from '../widgets/aboutMe'
import RelatedPostsWidget from '../widgets/relatedPosts/relatedPosts'

const Sidebar = ({relatedPosts}) => (
  <div>
    <AboutMeWidget />
    <RelatedPostsWidget posts={relatedPosts} />
  </div>
)

Sidebar.propTypes = {
  relatedPosts: PropTypes.arrayOf(PropTypes.object),
}

export default Sidebar
