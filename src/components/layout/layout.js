import React from 'react';
import '../../assets/styles/bulma.scss';
import 'bulma-timeline/dist/css/bulma-timeline.min.css';
import '../../assets/styles/code.scss';

import Navbar from '../navbar/navbar';

import '../../assets/styles/main.scss';
import './layout.scss';

const Layout = ({children}) => (
  <div>
    <Navbar/>
    <section className="section" id="mainSection" role="main">
      <div className="container">{children}</div>
    </section>
  </div>
);

export default Layout;
