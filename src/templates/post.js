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
  category,
  tags,
  title,
  date,
  slug,
  relatedPosts,
}) => {
  return (
    <div>
      <Breadcrumbs category={category} title={title} slug={slug} />
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
          <Sidebar category={category} relatedPosts={relatedPosts.edges} />
        </div>
      </div>
    </div>
  )
}

BlogPostTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  category: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string,
  date: PropTypes.string,
  slug: PropTypes.string,
}

const BlogPost = ({ data }) => {
  const { mdx: post,  allMdx : relatedPosts} = data
  const {title} = data.site.siteMetadata;

  return (
    <Layout>
      <Helmet title={`${post.frontmatter.title} | Blog | ${title}`} />
      <BlogPostTemplate
        id={post.id}
        content={post.body}
        category={post.frontmatter.category}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        slug={post.frontmatter.slug}
        relatedPosts={relatedPosts}
      />
    </Layout>
  )
}

BlogPost.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.object,
  }),
}

export default BlogPost

export const pageQuery = graphql`
    query PostBySlug($slug: String!, $tags: [String]) {
        site {
            siteMetadata {
                title
                author
            }
        }
        mdx(frontmatter: { slug: { eq: $slug } }) {
            ...PostListFields
        }
        allMdx(
            filter: {frontmatter: {tags: {in: $tags}, slug: { ne: $slug}}}
            limit: 4
        ) {
            edges {
                node {
                    ...PostListFields
                }
            }
        }
    }
`

