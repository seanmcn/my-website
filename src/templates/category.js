import React from 'react';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import PostList from '../components/blog/postList/postList';
import Pagination from '../components/blog/pagination/pagination';
import Sidebar from '../components/blog/sidebar';
import SEO from '../components/seo/seo';
import {slugToTitle} from '../utils/blog';

const Category = (props) => {
  const {data, pageContext} = props;
  const {edges: posts} = data.allMdx;
  const {name: category} = pageContext;
  const displayCategory = slugToTitle(category);
  const title = `Posts in category "${displayCategory}"`;

  return (
    <Layout>
      <div className="columns">
        <div className="column is-three-quarters" id="postMainColumn">
          <PostList posts={posts} title={title}/>
          <Pagination pageContext={pageContext}/>
        </div>
        <div className="column is-one-quarter" id="postSidebarColumn">
          <Sidebar/>
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

  return (
    <SEO
      title={`${displayCategory} - Category - ${siteTitle}`}
      description={`Browse posts in the ${displayCategory} category on Sean McNamara's blog.`}
      siteTitle={siteTitle}
      siteDescription={siteDescription}
      siteUrl={siteUrl}
      pathname={location.pathname}
    />
  );
};
