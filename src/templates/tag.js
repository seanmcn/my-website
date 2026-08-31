import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import LibraryScreen from '../components/library/libraryScreen';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {slugToTitle} from '../utils/content';

const TagPage = ({data, location, pageContext}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const displayTag = slugToTitle(pageContext.name);
  const blurb = `Everything tagged ${displayTag}.`;
  const title = `${displayTag} - Tag - ${siteTitle}`;

  return (
    <Layout>
      <RuntimeSeoSync
        description={blurb}
        pathname={location?.pathname || `/library/tags/${pageContext.slug}/`}
        siteUrl={siteUrl}
        title={title}
      />
      <LibraryScreen
        activeTag={pageContext.name}
        blurb={blurb}
        items={data.allMdx.edges.map(({node}) => node)}
        pageContext={pageContext}
        title={displayTag}
        totalCount={data.allMdx.totalCount}
      />
    </Layout>
  );
};

TagPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object,
  pageContext: PropTypes.object.isRequired,
};

export default TagPage;

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
      filter: {
        fields: {sourceInstanceName: {eq: "blog"}, visible: {eq: true}}
        frontmatter: {tags: {eq: $slug}}
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
  const displayTag = slugToTitle(pageContext.name);
  const title = `${displayTag} - Tag - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        description={`Browse everything tagged ${displayTag} on Sean ` +
          'McNamara\'s site.'}
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
      />
    </>
  );
};
