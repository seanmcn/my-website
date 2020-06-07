import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout'
import PostList from '../components/blog/postList/postList'
import Pagination from '../components/blog/pagination'
import Sidebar from '../components/blog/sidebar'

const Tag = props => {
  const { data, pageContext } = props
  const { edges: posts } = data.allWordpressPost
  const { title: siteTitle } = data.site.siteMetadata
  const { name: tag } = pageContext

  const postListTitle = `Posts tagged with "${tag}"`

  return (
    <Layout>
      <Helmet title={`${tag} | ${siteTitle}`} />
      <div className="columns">
        <div className="column is-three-quarters" id="postMainColumn">
          <PostList posts={posts} title={postListTitle} />
          <Pagination pageContext={pageContext} />
        </div>
        <div className="column is-one-quarter" id="postSidebarColumn">
          <Sidebar />
        </div>
      </div>
    </Layout>
  )
}

export default Tag

export const pageQuery = graphql`
  query TagPage($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allWordpressPost(filter: { tags: { elemMatch: { slug: { eq: $slug } } } }) {
      totalCount
      edges {
        node {
          ...PostListFields
        }
      }
    }
  }
`
