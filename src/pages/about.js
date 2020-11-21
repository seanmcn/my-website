import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout';
import staticData from '../data/static.json';
import Sidebar from '../components/sidebar/sidebar';

export default class AboutPage extends React.Component {
  render() {
    const { data } = this.props;
    const { title: siteTitle } = data.site.siteMetadata;

    return (
      <Layout>
        <Helmet>
          <title>{`About Me - ${siteTitle}`}</title>
        </Helmet>
        <div className="columns">
          <div className="column is-three-quarters">
            <div className="box">
              <h1 className="title">About Me</h1>
              <div
                className="content"
                dangerouslySetInnerHTML={{ __html: staticData.about_me }}
              />
            </div>
          </div>
          <div className="column is-one-quarter">
            <Sidebar />
          </div>
        </div>
      </Layout>
    );
  }
}

AboutPage.propTypes = {};

export const aboutPageQuery = graphql`
  query aboutPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
