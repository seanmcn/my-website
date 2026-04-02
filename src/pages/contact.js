import React from 'react';
import {graphql} from 'gatsby';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Layout from '../components/layout/layout';
import ContactForm from '../components/contactForm/contactForm';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import './contact.scss';

export default class ContactPage extends React.Component {
  render() {
    const {
      title: siteTitle,
      siteUrl,
    } = this.props.data.site.siteMetadata;
    const description = 'Get in touch with Seán McNamara about software engineering roles, project ideas, collaborations, or questions about the articles published on this site.';

    return (
      <Layout>
        <RuntimeSeoSync
          title={`Contact Me - ${siteTitle}`}
          description={description}
          pathname="/contact/"
          siteUrl={siteUrl}
        />
        <div className="contactPage">
          <section className="contactHero box">
            <div className="contactHeroEyebrow">Contact</div>
            <h1 className="title contactHeroTitle">Let&apos;s Talk</h1>
            <p className="contactHeroLead">
              Whether it&apos;s a project idea, an interesting role, a question
              about something I&apos;ve written, or just a general hello, this
              is the best place to reach me.
            </p>
          </section>

          <div className="contactPageGrid">
            <div className="contactPageMain">
              <div className="box contactFormCard">
                <h2 className="contactSectionTitle">Send a message</h2>
                <p className="contactSectionCopy">
                  Use the form below and I&apos;ll get back to you when I can.
                </p>
                <ContactForm />
              </div>
            </div>

            <aside className="contactPageAside">
              <div className="box contactLinksCard">
                <h2 className="contactSectionTitle">Elsewhere</h2>
                <div className="contactLinksList">
                  <a
                    className="contactLinkCard"
                    href="https://www.linkedin.com/in/mrseanmcn"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="contactLinkIcon">
                      <FontAwesomeIcon
                        icon={icon({name: 'linkedin', style: 'brands'})}
                      />
                    </span>
                    <span>
                      <strong>LinkedIn</strong>
                      <small>Professional profile</small>
                    </span>
                  </a>
                  <a
                    className="contactLinkCard"
                    href="https://github.com/seanmcn"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="contactLinkIcon">
                      <FontAwesomeIcon
                        icon={icon({name: 'github-alt', style: 'brands'})}
                      />
                    </span>
                    <span>
                      <strong>GitHub</strong>
                      <small>Code and experiments</small>
                    </span>
                  </a>
                </div>
              </div>
            </aside>
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
        description
        siteUrl
      }
    }
  }
`;

export const Head = ({data, location}) => {
  const {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
  } = data.site.siteMetadata;
  const title = `Contact Me - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description="Get in touch with Seán McNamara about software engineering roles, project ideas, collaborations, or questions about the articles published on this site."
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
