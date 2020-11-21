import React from 'react';
import Layout from '../components/layout/layout';
import Sidebar from '../components/sidebar/sidebar';
import NotFoundImage from '../assets/images/404.png';

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
          <img src={NotFoundImage} alt="404" />
        </div>
      </div>
      <div className="column is-one-quarter">
        <Sidebar />
      </div>
    </div>
  </Layout>
);

export default NotFoundPage;
