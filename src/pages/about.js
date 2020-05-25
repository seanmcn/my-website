import React from 'react'
import Layout from '../components/layout/layout'
import data from '../data/static.json'
import GithubReposWidget from '../components/widgets/githubRepos/githubRepos'
import LatestPostsWidget from '../components/widgets/latestPosts/latestPosts'
import Sidebar from '../components/layout/sidebar'

const AboutPage = () => (
  <Layout>
    <div className="columns">
      <div className="column is-three-quarters">
        <div className="box">
          <h1 className="title">About Me</h1>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: data.about_me }}
          />
        </div>
      </div>
      <div className="column is-one-quarter">
        <Sidebar />
      </div>
    </div>
  </Layout>
)

export default AboutPage
