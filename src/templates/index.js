import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout/layout'
import AboutMeWidget from '../components/widgets/aboutMe/aboutMe'
import LatestPostsWidget from '../components/widgets/latestPosts/latestPosts'
import GithubReposWidget from '../components/widgets/githubRepos/githubRepos'
import Timeline from '../components/timeline/timeline'

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const {
      title: siteTitle,
      description: siteDescription,
    } = data.site.siteMetadata
    return (
      <Layout>
        <Helmet>
          <title>{`Home - ${siteTitle}`}</title>
          <meta name="description" content={`${siteDescription}`} />
        </Helmet>
        <div className="columns is-multiline">
          <div className="column is-one-quarter">
            <AboutMeWidget />
          </div>
          <div className="column is-half">
            <div className="box">
              <h1 className="subtitle">Timeline</h1>
              <Timeline />
            </div>
          </div>
          <div className="column is-one-quarter">
            <GithubReposWidget />
            <LatestPostsWidget />
          </div>
        </div>
      </Layout>
    )
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
}

export const indexPageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
        description
      }
    }
  }
`
