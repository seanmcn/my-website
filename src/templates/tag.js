import React from 'react';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import PostList from '../components/blog/postList/postList';
import Pagination from '../components/blog/pagination/pagination';
import Sidebar from '../components/blog/sidebar';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {slugToTitle} from '../utils/blog';

const Tag = (props) => {
  const {data, pageContext} = props;
  const {edges: posts} = data.allMdx;
  const {name: tag} = pageContext;
  const displayTag = slugToTitle(tag);
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;

  return (
    <Layout>
      <RuntimeSeoSync
        title={`${displayTag} - Tag - ${siteTitle}`}
        description={`Browse posts tagged ${displayTag} on Sean McNamara's blog.`}
        pathname={props.location?.pathname || `/blog/tags/${pageContext.slug}/`}
        siteUrl={siteUrl}
      />
      <div className="columns">
        <div className="column is-three-quarters" id="postMainColumn">
          <PostList posts={posts}/>
          <Pagination pageContext={pageContext}/>
        </div>
        <div className="column is-one-quarter" id="postSidebarColumn">
          <Sidebar/>
        </div>
      </div>
    </Layout>
  );
};

export default Tag;

export const pageQuery = graphql`
  query TagPage($slug: String!, $limit: Int!, $skip: Int!) {
  site {
    siteMetadata {
      title
      description
      siteUrl
    }
  }
  allMdx(
    filter: {frontmatter: {tags: {eq: $slug}}}
    sort: {frontmatter: {date: DESC}}
    limit: $limit
    skip: $skip
  ) {
    edges {
      node {
        ...PostListFields
      }
    }
  }
}`;

export const Head = ({data, pageContext, location}) => {
  const {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
  } = data.site.siteMetadata;
  const displayTag = slugToTitle(pageContext.name);
  const title = `${displayTag} - Tag - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description={`Browse posts tagged ${displayTag} on Sean McNamara's blog.`}
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
