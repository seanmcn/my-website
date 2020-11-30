import React from 'react';
import Helmet from 'react-helmet';

import Navbar from '../navbar/navbar';

import '../../assets/styles/main.scss';
import './layout.scss';

const Layout = ({ children }) => (
  <div>
    <Helmet title="Home | Sean McNamara" />
    <Helmet
      bodyAttributes={{
        class: 'has-navbar-fixed-top',
      }}
    />
    <Helmet>
      <html lang="en" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Helmet>
    <Navbar />
    <section className="section" id="mainSection" role="main">
      <div className="container">{children}</div>
    </section>
  </div>
);

export default Layout;
