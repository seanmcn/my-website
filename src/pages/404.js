import React from 'react';
import {Link} from 'gatsby';
import Layout from '../components/layout/layout';
import NotFoundImage from '../assets/images/emojis/250/confused.png';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import './404.scss';

const NotFoundPage = () => (
  <Layout>
    <RuntimeSeoSync
      description="The page you were looking for could not be found."
      pathname="/404/"
      siteUrl="https://seanmcn.com"
      title="404 - Not Found"
    />
    <div className="pageWrap notFound">
      <div className="notFound__inner">
        <div className="eyebrow">404</div>
        <h1 className="notFound__title">This one isn&apos;t here</h1>
        <p className="notFound__body">
          The address doesn&apos;t match anything on the site. It may have moved
          when the library was reorganised, or it may never have existed.
        </p>
        <div className="notFound__links">
          <Link className="notFound__link" to="/library/">
            Browse the library →
          </Link>
          <Link className="notFound__link" to="/search/">
            Search everything →
          </Link>
        </div>
      </div>
      <img alt="" className="notFound__image" src={NotFoundImage} />
    </div>
  </Layout>
);

export default NotFoundPage;

export const Head = ({location}) => (
  <>
    <title>404 - Not Found</title>
    <SEO
      description="The page you were looking for could not be found."
      noIndex
      pathname={location.pathname}
      siteDescription=""
      siteTitle="Seán McNamara"
      siteUrl="https://seanmcn.com"
      title="404 - Not Found"
    />
  </>
);
