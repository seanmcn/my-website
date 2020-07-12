import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout'
import PostList from '../components/blog/postList/postList'
import Pagination from '../components/blog/pagination'
import Sidebar from '../components/blog/sidebar'
import { slugToTitle } from '../utils/blog';

const Category = props => {
  const { data, pageContext } = props
  const { edges: posts } = data.allMdx
  // const { edges: posts } = []
  const { title: siteTitle } = data.site.siteMetadata
  // const { title: siteTitle } = 'SEAN'
  const { name: category } = pageContext
  const displayCategory = slugToTitle(category);
  const title = `Posts in category "${displayCategory}"`

  return (
    <Layout>
      <Helmet title={`${displayCategory} | ${siteTitle}`} />
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
        allMdx(filter: {frontmatter: {category: {eq: $slug}}}) {
            edges {
                node {
                    ...PostListFields
                }
            }
        }
    }
`