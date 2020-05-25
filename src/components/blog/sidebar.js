import React from 'react'
import PropTypes from 'prop-types'
import AboutMeWidget from '../widgets/aboutMe'
import RelatedPostsWidget from '../widgets/relatedPosts/relatedPosts'
import CategoriesWidget from '../widgets/categories/categoriesWidget'
import TagsWidget from '../widgets/tags/tagsWidget'

const Sidebar = ({ relatedPosts }) => (
  <div>
    <RelatedPostsWidget posts={relatedPosts} />
    <CategoriesWidget />
    <TagsWidget />
  </div>
)

Sidebar.propTypes = {
  relatedPosts: PropTypes.arrayOf(PropTypes.object),
}

export default Sidebar
