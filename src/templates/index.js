import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import StaticData from '../data/static.json'
import Layout from '../components/layout/layout'
import AboutMeWidget from '../components/widgets/aboutMe/aboutMe'
import LatestPostsWidget from '../components/widgets/latestPosts/latestPosts'
import GithubReposWidget from '../components/widgets/githubRepos/githubRepos'

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { title: siteTitle, description: siteDescription } = data.site.siteMetadata
    return (
      <Layout>
        <Helmet>
          <title>{`Home - ${siteTitle}`}</title>
          <meta name="description" content={`${siteDescription}`} />
        </Helmet>
        <div className="columns is-multiline">
          <div className="column is-one-fifth">
            <AboutMeWidget />
          </div>
          <div className="column is-three-fifths">
            <div className="box">
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: StaticData.about_me,
                }}
              />
            </div>
          </div>
          <div className="column is-one-fifth">
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
