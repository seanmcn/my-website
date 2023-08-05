import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import Breadcrumbs from '../components/blog/breadcrumbs/breadcrumbs';
import Sidebar from '../components/blog/sidebar';
import Post from '../components/blog/post/post';
import RelatedPosts from '../components/blog/post/relatedPosts';

const BlogPostTemplate = ({
  id,
  content,
  category,
  tags,
  title,
  date,
  slug,
  relatedPosts,
  featured,
}) => (
  <div>
    <Breadcrumbs category={category} title={title} slug={slug}/>
    <div className="columns">
      <div className="column is-four-fifths-desktop is-three-quarters-tablet"
        id="postMainColumn">
        <Post
          id={id}
          slug={slug}
          title={title}
          content={content}
          date={date}
          tags={tags}
          featured={featured}
        />
        <RelatedPosts relatedPosts={relatedPosts}/>
      </div>

      <div className="column
      is-one-fifth-desktop
      is-one-quarter-tablet" id="postSidebarColumn">
        <Sidebar category={category}/>
      </div>
    </div>
  </div>
);

BlogPostTemplate.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  category: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
  date: PropTypes.string,
  slug: PropTypes.string,
  featured: PropTypes.any,
};

const BlogPost = ({data, children}) => {
  const {mdx: post, relatedMdxs: relatedPosts} = data;
  const {title} = data.site.siteMetadata;

  const featured = post.frontmatter.featured ?
    post.frontmatter.featured :
    null;

  return (
    <Layout>
      <Helmet>
        <title>{`${post.frontmatter.title} - Blog - ${title}`}</title>
      </Helmet>
      <BlogPostTemplate
        id={post.id}
        content={children}
        category={post.frontmatter.category}
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
        date={post.frontmatter.date}
        slug={post.frontmatter.slug}
        relatedPosts={relatedPosts}
        featured={featured}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.object,
  }),
};

export default BlogPost;

export const pageQuery = graphql`
  query PostBySlug($slug: String!, $id: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    mdx(frontmatter: { slug: { eq: $slug } }) {
      ...PostListFields
    }
    relatedMdxs(parent: { id: { eq: $id } }) {
      posts {
        frontmatter {
          title,
          slug,
          tags
        }
      }
    }
  }
`;
