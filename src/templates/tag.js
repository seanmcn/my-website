import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout'
import PostList from '../components/blog/postList'
import Pagination from '../components/blog/pagination'
import Sidebar from '../components/blog/sidebar'

const Tag = props => {
  const { data, pageContext } = props
  const { edges: posts, totalCount } = data.allWordpressPost
  const { title: siteTitle } = data.site.siteMetadata
  const { name: tag } = pageContext
  const title = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } with the tag ${tag}`

  return (
    <Layout>
      <Helmet title={`${tag} | ${siteTitle}`} />
      {/*<h2>{title}</h2>*/}
      <div className="columns">
        <div className="column is-three-quarters" id="postMainColumn">
          <PostList posts={posts} />
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
