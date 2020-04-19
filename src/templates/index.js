import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link } from 'gatsby'
import Helmet from 'react-helmet'
import StaticData from '../data/static'
import Layout from '../components/layout/layout'
import AboutMeWidget from '../components/widgets/aboutMe'
import LatestPostsWidget from '../components/widgets/latestPosts/latestPosts'
import GithubReposWidget from '../components/widgets/githubRepos/githubRepos'

export default class IndexPage extends React.Component {
  render() {
    const { data } = this.props
    const { title: siteTitle } = data.site.siteMetadata
    const { edges: posts } = data.allWordpressPost
    return (
      <Layout>
        <Helmet title={`Home | ${siteTitle}`} />
        <div className="columns is-multiline">
          <div className="column is-one-quarter">
            <AboutMeWidget />
            <LatestPostsWidget posts={posts} />
          </div>
          <div className="column is-three-quarters">
            <div className="box">
              <h1 className="subtitle">About Me</h1>
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html: StaticData.about_me,
                }}
              />
              <Link to="/about">
                <button className="button is-small is-fullwidth" type="button">
                  Read More
                </button>
              </Link>
            </div>
            <div className="columns">
              <div className="column is-half">
                <GithubReposWidget />
              </div>
              <div className="column is-half">
                <div className="box">
                  <h1 className="subtitle">Blog Post Series</h1>
                  <div className="content">
                    <ul className="link-list">
                      <li className="list-item">
                        <a href="">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit.
                        </a>
                      </li>
                      <li className="list-item">
                        <a href="">
                          Praesent ac sapien vel orci tincidunt ornare.
                        </a>
                      </li>
                      <li className="list-item">
                        <a href="">
                          Nam vel massa eu dui fringilla elementum et eget
                          turpis.
                        </a>
                      </li>
                    </ul>
                  </div>
                  <button className="button is-link is-small is-fullwidth">
                    View more
                  </button>
                </div>
              </div>
            </div>
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
      }
    }
    allWordpressPost(sort: { fields: date, order: DESC }, limit: 5, skip: 0) {
      edges {
        node {
          ...PostListFields
        }
      }
    }
  }
`
