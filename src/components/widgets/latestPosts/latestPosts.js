import React from 'react'
import PropTypes from 'prop-types'
import LatestPostListItem from './latestPostListItem'
import WidgetBox from '../widgetBox'

export default class LatestPostsWidget extends React.Component {
  render() {
    const { posts } = this.props

    return (
      <WidgetBox
        title="Latest Posts"
        content={(
          <ul>
            {posts.map(({ node: post }) => (
              <LatestPostListItem
                key={post.id}
                id={post.id}
                slug={post.slug}
                title={post.title}
              />
            ))}
          </ul>
        )}
      />
    )
  }
}

LatestPostsWidget.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
}
