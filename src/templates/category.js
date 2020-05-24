import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout'
import PostList from '../components/blog/postList/postList'
import Pagination from '../components/blog/pagination'
import Sidebar from '../components/blog/sidebar'

const Category = props => {
  const { data, pageContext } = props
  const { edges: posts } = data.allWordpressPost
  const { title: siteTitle } = data.site.siteMetadata
  const { name: category } = pageContext
  const title = `Posts in category "${category}"`

  return (
    <Layout>
      <Helmet title={`${category} | ${siteTitle}`} />
      <div className="columns">
        <div className="column is-three-quarters" id="postMainColumn">
          <PostList posts={posts} title={title} />
          <Pagination pageContext={pageContext} />
        </div>
        <div className="column is-one-quarter" id="postSidebarColumn">
          <Sidebar />
        </div>
      </div>
    </Layout>
  )
}

export default Category

export const pageQuery = graphql`
  query CategoryPage($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allWordpressPost(
      filter: { categories: { elemMatch: { slug: { eq: $slug } } } }
    ) {
      totalCount
      edges {
        node {
          ...PostListFields
        }
      }
    }
  }
`
