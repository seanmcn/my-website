import React from 'react'
import Layout from '../components/layout/layout'
import Sidebar from '../components/blog/sidebar'
import data from '../data/static.json'

const AboutPage = () => (
  <Layout>
    <div className="columns">
      <div className="column is-three-quarters" id="postMainColumn">
        <div className="box">
          <h1 className="title">About Me</h1>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: data.about_me }}
          />
        </div>
      </div>
      <div className="column is-one-quarter" id="postSidebarColumn">
        <Sidebar />
      </div>
    </div>
  </Layout>
)

export default AboutPage
