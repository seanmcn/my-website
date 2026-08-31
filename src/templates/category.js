import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import LibraryScreen from '../components/library/libraryScreen';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {slugToTitle} from '../utils/content';

const CategoryPage = ({data, location, pageContext}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const displayCategory = slugToTitle(pageContext.name);
  const blurb = `Everything filed under ${displayCategory}: posts, notes ` +
    'and finds.';
  const title = `${displayCategory} - Category - ${siteTitle}`;

  return (
    <Layout>
      <RuntimeSeoSync
        description={blurb}
        pathname={
          location?.pathname || `/library/categories/${pageContext.slug}/`
        }
        siteUrl={siteUrl}
        title={title}
      />
      <LibraryScreen
        activeCategory={pageContext.name}
        blurb={blurb}
        items={data.allMdx.edges.map(({node}) => node)}
        pageContext={pageContext}
        title={displayCategory}
        totalCount={data.allMdx.totalCount}
      />
    </Layout>
  );
};

CategoryPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object,
  pageContext: PropTypes.object.isRequired,
};

export default CategoryPage;

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
      filter: {
        fields: {sourceInstanceName: {eq: "blog"}, visible: {eq: true}}
        frontmatter: {category: {eq: $slug}}
      }
      sort: {frontmatter: {date: DESC}}
      limit: $limit
      skip: $skip
    ) {
      totalCount
      edges {
        node {
          ...LibraryItemFields
        }
      }
    }
  }
`;

export const Head = ({data, location, pageContext}) => {
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
        description={
          `Browse everything in the ${displayCategory} category on Sean ` +
          'McNamara\'s site.'
        }
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
      />
    </>
  );
};
