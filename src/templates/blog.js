import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import PostList from '../components/blog/postList/postList';
import Pagination from '../components/blog/pagination/pagination';
import Sidebar from '../components/blog/sidebar';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import './blog.scss';

export default class BlogPage extends React.Component {
  render() {
    const {data, pageContext} = this.props;
    const {
      title: siteTitle,
      siteUrl,
    } = data.site.siteMetadata;
    const currentPage = pageContext.currentPage || 1;
    const title = `Blog - ${siteTitle}`;
    const description = currentPage > 1 ?
      `Page ${currentPage} of the Sean McNamara blog archive covering
      software engineering, workflow, AI, DevOps, and programming.` :
      'Articles on software engineering, workflow, AI, DevOps, backend ' +
      'systems, and practical development.';
    const {edges: posts} = data.allMdx;

    return (
      <Layout>
        <RuntimeSeoSync
          title={title}
          description={description}
          pathname={pageContext.currentPage > 1 ?
            `/blog/page/${pageContext.currentPage}/` :
            '/blog/'}
          siteUrl={siteUrl}
        />
        <div className="columns blogPageLayout">
          <div className="column
          is-four-fifths-desktop
          is-three-quarters-tablet" id="postMainColumn">
            <PostList posts={posts} />
            <Pagination pageContext={pageContext} />
          </div>
          <div className="column
          is-one-fifth-desktop
          is-one-quarter-tablet
          blogSidebarColumn
          blogSidebarColumn--hide-mobile" id="postsSidebarColumn">
            <Sidebar hideOnMobile />
          </div>
        </div>
      </Layout>
    );
  }
}

BlogPage.propTypes = {
  data: PropTypes.shape({
    allMdx: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      edges: PropTypes.array,
    }),
  }),
  pageContext: PropTypes.shape({
    currentPage: PropTypes.number,
    numPages: PropTypes.number,
  }),
};

export const blogPageQuery = graphql`
  query BlogIndexQuery($limit: Int!, $skip: Int!) {
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
    filter: {fields: {sourceInstanceName: {eq: "blog"}}}
  ) {
    edges {
      node {
        ...PostListFields
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
  const currentPage = pageContext.currentPage || 1;
  const title = `Blog - ${siteTitle}`;
  const description = currentPage > 1 ?
      `Page ${currentPage} of the Sean McNamara blog archive covering
      software engineering, workflow, AI, DevOps, and programming.` :
      'Articles on software engineering, workflow, AI, DevOps, backend ' +
      'systems, and practical development.';

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description={description}
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
