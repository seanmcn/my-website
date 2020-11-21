import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/layout/layout';
import Sidebar from '../components/sidebar/sidebar';
import ContactForm from '../components/contactForm/contactForm';

export default class ContactPage extends React.Component {
  render() {
    const { data } = this.props;
    const { title: siteTitle } = data.site.siteMetadata;

    return (
      <Layout>
        <Helmet>
          <title>{`Contact Me - ${siteTitle}`}</title>
        </Helmet>
        <div className="columns">
          <div className="column is-three-quarters" id="postMainColumn">
            <div className="box">
              <h1 className="title">Contact Me</h1>
              <ContactForm />
            </div>
          </div>
          <div className="column is-one-quarter" id="postSidebarColumn">
            <Sidebar />
          </div>
        </div>
      </Layout>
    );
  }
}

export const contactPageQuery = graphql`
  query contactPageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
