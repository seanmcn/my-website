import React from 'react';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import PostList from '../components/blog/postList/postList';
import Pagination from '../components/blog/pagination/pagination';
import Sidebar from '../components/blog/sidebar';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {slugToTitle} from '../utils/blog';

const Category = (props) => {
  const {data, pageContext} = props;
  const {edges: posts} = data.allMdx;
  const {name: category} = pageContext;
  const displayCategory = slugToTitle(category);
  const title = `Posts in category "${displayCategory}"`;
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;

  return (
    <Layout>
      <RuntimeSeoSync
        title={`${displayCategory} - Category - ${siteTitle}`}
        description={
          `Browse posts in the ${displayCategory} category on Sean McNamara's
          blog.`
        }
        pathname={
          props.location?.pathname ||
          `/blog/categories/${pageContext.slug}/`
        }
        siteUrl={siteUrl}
      />
      <div className="columns">
        <div className="column is-three-quarters" id="postMainColumn">
          <PostList posts={posts} title={title}/>
          <Pagination pageContext={pageContext}/>
        </div>
        <div className="column is-one-quarter blogSidebarColumn
        blogSidebarColumn--hide-mobile" id="postSidebarColumn">
          <Sidebar hideOnMobile />
        </div>
      </div>
    </Layout>
  );
};

export default Category;

export const pageQuery = graphql`
  query CategoryPage($slug: String!, $limit: Int!, $skip: Int!) {
  site {
    siteMetadata {
      title
      description
      siteUrl
    }
  }
  allMdx(
    filter: {frontmatter: {category: {eq: $slug}}}
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
  const displayCategory = slugToTitle(pageContext.name);
  const title = `${displayCategory} - Category - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description={
          `Browse posts in the ${displayCategory} category on Sean McNamara's
          blog.`
        }
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
