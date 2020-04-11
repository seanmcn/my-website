import React from 'react'
import Helmet from 'react-helmet'

import Navbar from './navbar'

import '../../assets/styles/main.scss'
import '../layout/layout.scss'

const TemplateWrapper = ({ children }) => (
  <div>
    <Helmet title="Home | Sean McNamara" />
    <Helmet
      bodyAttributes={{
        class: 'has-navbar-fixed-top',
      }}
    />
    <Navbar />
    <section className="section" id="mainSection">
      <div className="container">{children}</div>
    </section>
  </div>
)

export default TemplateWrapper
