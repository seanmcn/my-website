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
    </Helmet>
    <Navbar />
    <section className="section" id="mainSection">
      <div className="container">{children}</div>
    </section>
  </div>
);

export default Layout;
