import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Helmet from 'react-helmet'
import Layout from '../components/layout/layout'
import Sidebar from '../components/blog/sidebar'

export default class PortfolioPage extends React.Component {
  render() {
    const { data } = this.props
    const { title: siteTitle } = data.site.siteMetadata

    return (
      <Layout>
        <Helmet title={`Portfolio | ${siteTitle}`} />
        <div className="columns">
          <div className="column is-three-quarters" id="postMainColumn">
            Hello!
          </div>
          <div className="column is-one-quarter" id="postSidebarColumn">
            <Sidebar />
          </div>
        </div>
      </Layout>
    )
  }
}

PortfolioPage.propTypes = {
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

export const portfolioPageQuery = graphql`
  query PortfolioQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
