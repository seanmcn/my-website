import React from 'react';
import PropTypes from 'prop-types';
import SiteHeader from './siteHeader';

import '../../assets/styles/main.scss';
import '../../assets/styles/content.scss';
import '../../assets/styles/code.scss';
import './layout.scss';

const currentYear = new Date().getFullYear();

const Layout = ({children}) => (
  <div className="siteShell">
    <SiteHeader />
    <main id="mainSection" role="main">
      {children}
    </main>
    <footer className="siteFooter">
      <div className="siteFooter__inner shell">
        <div className="siteFooter__colophon">
          <p className="siteFooter__copyright">
            © 2009–{currentYear}
            <br />
            Seán McNamara
          </p>
          <div className="siteFooter__text">
            <p>
              Words, code, and questionable opinions are mine unless licensed
              otherwise.
            </p>
            <p>
              Views are my own, not my employer’s or the robots’. If you use
              something, link back.
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
);

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
