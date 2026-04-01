import React from 'react';
import Layout from '../components/layout/layout';
import Sidebar from '../components/sidebar/sidebar';
import NotFoundImage from '../assets/images/emojis/250/confused.png';
import SEO from '../components/seo/seo';

const NotFoundPage = () => (
  <Layout>
    <div className="columns">
      <div className="column is-three-quarters">
        <div className="box">
          <h1 className="title">404 - NOT FOUND</h1>
          <p>
            <strong>
              You just hit a route that doesn&#39;t exist... the sadness.
            </strong>
          </p>
          <img src={NotFoundImage} alt="Seán confused" />
        </div>
      </div>
      <div className="column is-one-quarter">
        <Sidebar />
      </div>
    </div>
  </Layout>
);

export default NotFoundPage;

export const Head = ({location}) => (
  <SEO
    title="404 - Not Found"
    description="The page you were looking for could not be found."
    siteTitle="Seán McNamara"
    siteDescription=""
    siteUrl="https://seanmcn.com"
    pathname={location.pathname}
    noIndex={true}
  />
);
