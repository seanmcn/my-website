import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout'
import PostList from '../components/blog/postList/postList'
import Pagination from '../components/blog/pagination'
import Sidebar from '../components/blog/sidebar'
import { slugToTitle } from '../utils/blog';

const Tag = props => {
  const { data, pageContext } = props
  const { edges: posts } = data.allMdx
  const { title: siteTitle } = data.site.siteMetadata
  const { name: tag } = pageContext
  const displayTag = slugToTitle(tag);

  const postListTitle = `Posts tagged with "${displayTag}"`

  return (
    <Layout>
      <Helmet>
        <title>{`${displayTag} - Tag - ${siteTitle}`}</title>
      </Helmet>
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
        allMdx(filter: {frontmatter: {tags: {eq: $slug}}}, sort: {fields: frontmatter___date, order: DESC}) {
            edges {
                node {
                    ...PostListFields
                }
            }
        }
    }
`

