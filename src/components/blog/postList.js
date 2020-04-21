import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Post from './post/post'

export default class IndexPage extends React.Component {
  render() {
    const { posts, title } = this.props

    return (
      <div>
        <h2>{title}</h2>
        {posts.map(({ node: post }) => (
          <Post
            key={post.id}
            id={post.id}
            slug={post.slug}
            title={post.title}
            content={post.content}
            date={post.date}
            tags={post.tags}
          />
        ))}
      </div>
    )
  }
}

IndexPage.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
}

export const pageQuery = graphql`
  fragment PostListFields on wordpress__POST {
    id
    title
    content
    tags {
      name
      slug
    }
    author {
      name
      slug
      avatar_urls {
        wordpress_48
      }
    }
    date(formatString: "MMMM DD, YYYY")
    slug
  }
`
