import React from 'react'
import PropTypes from 'prop-types'
import PostListItem from '../../blog/postList/postListItem'
import WidgetBox from '../widgetBox'

const RelatedPostsWidget = ({ posts }) => {
  if (posts) {
    return (
      <WidgetBox
        title="Related Posts"
        content={
          <ul className="link-list">
            {posts.map(({ node: post }) => (
              <PostListItem
                key={post.id}
                id={post.id}
                slug={post.frontmatter.slug}
                title={post.frontmatter.title}
              />
            ))}
          </ul>
        }
      />
    )
  }
  return <div />
}

RelatedPostsWidget.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
}

export default RelatedPostsWidget
