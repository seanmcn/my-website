import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import Sidebar from '../components/blog/sidebar';
import Post from '../components/blog/post/post';
import RelatedPosts from '../components/blog/post/relatedPosts';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';

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
  seriesTitle,
  seriesCount,
  seriesIndex,
  seriesPosts,
  previousInSeries,
  nextInSeries,
}) => (
  <div>
    <div className="columns">
      <div className="column is-four-fifths-desktop is-three-quarters-tablet"
        id="postMainColumn">
        <Post
          id={id}
          slug={slug}
          title={title}
          content={content}
          date={date}
          category={category}
          tags={tags}
          featured={featured}
          seriesTitle={seriesTitle}
          seriesCount={seriesCount}
          seriesIndex={seriesIndex}
          seriesPosts={seriesPosts}
          previousInSeries={previousInSeries}
          nextInSeries={nextInSeries}
        />
        <RelatedPosts relatedPosts={relatedPosts}/>
      </div>

      <div className="column
      is-one-fifth-desktop
      is-one-quarter-tablet
      blogSidebarColumn
      blogSidebarColumn--hide-mobile" id="postSidebarColumn">
        <Sidebar hideOnMobile />
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
  relatedPosts: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string,
    date: PropTypes.string,
    excerpt: PropTypes.string,
    reason: PropTypes.string,
    slug: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string.isRequired,
  })).isRequired,
  featured: PropTypes.any,
  nextInSeries: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  previousInSeries: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  seriesCount: PropTypes.number,
  seriesIndex: PropTypes.number,
  seriesPosts: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    seriesOrder: PropTypes.number,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })),
  seriesTitle: PropTypes.string,
};

const BlogPost = ({data, children, location, pageContext}) => {
  const {mdx: post} = data;
  const {
    nextInSeries = null,
    previousInSeries = null,
    relatedPosts = [],
    seriesCount = 0,
    seriesIndex = null,
    seriesPosts = [],
    seriesTitle = null,
  } = pageContext;
  const {
    title: siteTitle,
    siteUrl,
  } = data.site.siteMetadata;

  const featured = post.frontmatter.featured ?
    post.frontmatter.featured :
    null;

  return (
    <Layout>
      <RuntimeSeoSync
        title={`${post.frontmatter.title} - Blog - ${siteTitle}`}
        description={post.excerpt}
        pathname={location?.pathname || `/blog/${post.frontmatter.slug}/`}
        siteUrl={siteUrl}
      />
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
        seriesTitle={seriesTitle}
        seriesCount={seriesCount}
        seriesIndex={seriesIndex}
        seriesPosts={seriesPosts}
        previousInSeries={previousInSeries}
        nextInSeries={nextInSeries}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.object,
    site: PropTypes.object,
  }),
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  pageContext: PropTypes.shape({
    nextInSeries: PropTypes.object,
    previousInSeries: PropTypes.object,
    relatedPosts: PropTypes.array,
    seriesCount: PropTypes.number,
    seriesIndex: PropTypes.number,
    seriesPosts: PropTypes.array,
    seriesTitle: PropTypes.string,
  }),
};

export default BlogPost;

export const pageQuery = graphql`
  query PostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        description
        siteUrl
        author
      }
    }
    mdx(frontmatter: { slug: { eq: $slug } }) {
      ...PostListFields
      excerpt(pruneLength: 160)
    }
  }
`;

export const Head = ({data, location}) => {
  const {mdx: post} = data;
  const {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
  } = data.site.siteMetadata;
  const title = `${post.frontmatter.title} - Blog - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description={post.excerpt}
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
        type="article"
      />
    </>
  );
};
