import React from 'react'
import PropTypes from 'prop-types'
import PostListItem from '../../blog/postList/postListItem'
import WidgetBox from '../widgetBox'

const LatestPostsWidget = ({ posts }) => {
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
                slug={post.slug}
                title={post.title}
              />
            ))}
          </ul>
        }
      />
    )
  }
  return <div />
}

LatestPostsWidget.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
}

export default LatestPostsWidget
