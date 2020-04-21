import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Layout from '../components/layout/layout'
import Breadcrumbs from '../components/blog/breadcrumbs/breadcrumbs'
import Sidebar from '../components/blog/sidebar'
import Post from '../components/blog/post/post'

export const BlogPostTemplate = ({
  id,
  content,
  categories,
  tags,
  title,
  date,
  slug,
  relatedPosts,
}) => {
  return (
    <div>
      <Breadcrumbs categories={categories} title={title} slug={slug} />
      <div className="columns">
        <div className="column is-three-quarters" id="postMainColumn">
          <Post
            id={id}
            slug={slug}
            title={title}
            content={content}
            date={date}
            tags={tags}
          />
        </div>

        <div className="column is-one-quarter" id="postSidebarColumn">
          <Sidebar categories={categories} relatedPosts={relatedPosts.edges} />
        </div>
      </div>
    </div>
  )
}

BlogPostTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  date: PropTypes.string,
  slug: PropTypes.string,
  relatedPosts: PropTypes.shape({
    edges: PropTypes.array,
  }),
}

const BlogPost = ({ data }) => {
  const { wordpressPost: post, allWordpressPost: relatedPosts } = data

  return (
    <Layout>
      <Helmet title={`${post.title} | Blog`} />
      <BlogPostTemplate
        id={post.id}
        content={post.content}
        categories={post.categories}
        tags={post.tags}
        title={post.title}
        date={post.date}
        slug={post.slug}
        relatedPosts={relatedPosts}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
    fragment PostFields on wordpress__POST {
        id
        slug
        content
        date(formatString: "MMMM DD, YYYY")
        title
    }
    query BlogPostByID($id: String!, $tags: [String]) {
        wordpressPost(id: { eq: $id }) {
            id
            title
            slug
            content
            date(formatString: "MMMM DD, YYYY")
            categories {
                name
                slug
            }
            tags {
                name
                slug
            }
        }
        allWordpressPost(filter: {tags: {elemMatch: {slug: {in: $tags}}}, id: {ne: $id}}, limit: 4) {
            edges {
                node {
                    id
                    title
                    slug
                }
            }
        }
    }
`
