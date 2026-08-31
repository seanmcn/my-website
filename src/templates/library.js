import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import LibraryScreen from '../components/library/libraryScreen';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {LIBRARY_HEADINGS} from '../utils/content';

const LibraryPage = ({data, pageContext}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const filter = pageContext.activeFilter || 'all';
  const [title, blurb] = LIBRARY_HEADINGS[filter];
  const items = pageContext.isEmpty ?
    [] :
    data.allMdx.edges.map(({node}) => node);
  const pageTitle = `${title} - ${siteTitle}`;
  const pathname = pageContext.humanPageNumber > 1 ?
    `${pageContext.paginate_link}/page/${pageContext.humanPageNumber}/` :
    `${pageContext.paginate_link}/`;

  return (
    <Layout>
      <RuntimeSeoSync
        description={blurb}
        pathname={pathname}
        siteUrl={siteUrl}
        title={pageTitle}
      />
      <LibraryScreen
        activeFilter={filter}
        blurb={blurb}
        items={items}
        pageContext={pageContext}
        title={title}
        totalCount={pageContext.isEmpty ? 0 : data.allMdx.totalCount}
      />
    </Layout>
  );
};

LibraryPage.propTypes = {
  data: PropTypes.object.isRequired,
  pageContext: PropTypes.object.isRequired,
};

export default LibraryPage;

export const libraryQuery = graphql`
  query LibraryQuery($limit: Int!, $skip: Int!, $itemTypes: [String]) {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMdx(
      sort: {frontmatter: {date: DESC}}
      limit: $limit
      skip: $skip
      filter: {
        fields: {
          sourceInstanceName: {eq: "blog"}
          visible: {eq: true}
          itemType: {in: $itemTypes}
        }
      }
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
  const [title, blurb] = LIBRARY_HEADINGS[pageContext.activeFilter || 'all'];
  const pageTitle = `${title} - ${siteTitle}`;

  return (
    <>
      <title>{pageTitle}</title>
      <SEO
        description={blurb}
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={pageTitle}
      />
    </>
  );
};
