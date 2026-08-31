import React from 'react';
import PropTypes from 'prop-types';
import SiteHeader from './siteHeader';
import useLibraryMeta from '../../hooks/useLibraryMeta';

import '../../assets/styles/main.scss';
import '../../assets/styles/content.scss';
import '../../assets/styles/code.scss';
import './layout.scss';

const Layout = ({children}) => {
  const {yearRange} = useLibraryMeta();

  return (
    <div className="siteShell">
      <SiteHeader />
      <main id="mainSection" role="main">
        {children}
      </main>
      <footer className="siteFooter shell">
        <span>Seán McNamara</span>
        <span className="siteFooter__years">{yearRange}</span>
      </footer>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
