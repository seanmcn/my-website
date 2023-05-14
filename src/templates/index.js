import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout';
import AboutMeWidget from '../components/widgets/aboutMe/aboutMe';
// eslint-disable-next-line max-len
import LatestPostsHomeWidget from '../components/widgets/latestPosts/latestPostsHome';
import GithubReposWidget from '../components/widgets/githubRepos/githubRepos';


export default class IndexPage extends React.Component {
  render() {
    const {data} = this.props;
    const {
      title: siteTitle,
      description: siteDescription,
    } = data.site.siteMetadata;
    return (
      <Layout>
        <Helmet>
          <title>{`Home - ${siteTitle}`}</title>
          <meta name="description" content={`${siteDescription}`} />
        </Helmet>
        <div className="columns is-multiline">
          <div className="column is-one-fifths-desktop is-one-quarters-tablet">
            <AboutMeWidget />
            <GithubReposWidget />
          </div>
          <div className="column is-four-fifths-desktop is-three-quarters-tablet">
            <LatestPostsHomeWidget />
          </div>
        </div>
      </Layout>
    );
  }
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    allWordpressPost: PropTypes.shape({
      // eslint-disable-next-line react/forbid-prop-types
      edges: PropTypes.array,
    }),
  }),
  pageContext: PropTypes.shape({
    currentPage: PropTypes.number,
    numPages: PropTypes.number,
  }),
};

export const indexPageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`;
