import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import PostListItem from '../../blog/postListItem'
import WidgetBox from '../widgetBox'

const LatestPostsWidget = () => {
  const data = useStaticQuery(graphql`
    query latestPostsQuery {
      allWordpressPost(sort: { fields: date, order: DESC }, limit: 4, skip: 0) {
        edges {
          node {
            ...PostListFields
          }
        }
      }
    }
  `)
  const { edges: posts } = data.allWordpressPost
  return (
    <WidgetBox
      title="Latest Posts"
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

export default LatestPostsWidget
