import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout';
import PostList from '../components/blog/postList/postList';
import Sidebar from '../components/blog/sidebar';
import Pagination from '../components/blog/pagination/pagination';

export default class BlogPage extends React.Component {
  render() {
    const {data, pageContext} = this.props;

    const {edges: posts} = data.allMdx;
    const {title: siteTitle} = data.site.siteMetadata;

    return (
      <Layout>
        <Helmet>
          <title>{`Blog - ${siteTitle}`}</title>
        </Helmet>
        <div className="columns">
          <div className="column is-three-quarters" id="postMainColumn">
            <PostList posts={posts} />
            <Pagination pageContext={pageContext} />
          </div>
          <div className="column is-one-quarter" id="postSidebarColumn">
            <Sidebar />
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
      }
    }
    allMdx(
      sort: { fields: frontmatter___date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          ...PostListFields
        }
      }
    }
  }
`;
