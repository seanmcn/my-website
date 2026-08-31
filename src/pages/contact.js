import React from 'react';
import PropTypes from 'prop-types';
import {graphql, Link} from 'gatsby';
import Layout from '../components/layout/layout';
import ContactForm from '../components/contactForm/contactForm';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import {ElsewhereLinks} from './about';
import avatar from '../assets/images/emojis/250/wave.png';
import {itemPath} from '../utils/content';
import './contact.scss';

const DESCRIPTION = 'Get in touch with Seán McNamara about software ' +
  'engineering roles, project ideas, collaborations, or questions about the ' +
  'articles published on this site.';

const EMAIL = 'me@seanmcn.com';

const RAIL = [
  {label: 'Based in', value: 'London'},
  {label: 'Timezone', value: 'GMT / BST'},
];

const ContactPage = ({data, location}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;

  /*
   * Articles end with "Get in touch about this", which arrives here as
   * ?about=<slug>. Resolving it to a title lets the form say what it is a
   * reply to, and passes the link along with the message.
   */
  const aboutSlug = React.useMemo(() => {
    if (!location?.search) {
      return null;
    }

    return new URLSearchParams(location.search).get('about');
  }, [location?.search]);

  const [dismissed, setDismissed] = React.useState(false);
  const replyTo = aboutSlug && !dismissed ?
    data.allMdx.nodes.find(node => node.frontmatter.slug === aboutSlug) :
    null;

  return (
    <Layout>
      <RuntimeSeoSync
        description={DESCRIPTION}
        pathname="/contact/"
        siteUrl={siteUrl}
        title={`Contact Me - ${siteTitle}`}
      />
      <div className="pageWrap contactPage">
        <div className="contactPage__cols">
          <aside className="rail rail--bio contactBio">
            <span className="contactBio__portrait">
              <img alt="Seán McNamara" src={avatar} />
            </span>

            <div>
              <div className="eyebrow">Contact</div>
              <div className="contactBio__intro">
                <p className="contactBio__blurb">
                  Everything reaches me. Email is the surest route, but any of
                  these work.
                </p>
                <span className="contactBio__avatarSmall">
                  <img alt="" src={avatar} />
                </span>
              </div>
            </div>

            <div>
              {RAIL.map(row => (
                <div className="contactBio__row" key={row.label}>
                  <span>{row.label}</span>
                  <span className="contactBio__value">{row.value}</span>
                </div>
              ))}
            </div>
          </aside>

          <div className="contactPage__main">
            <div className="stickyBar contactPage__bar">
              <h1 className="contactPage__title">Let&apos;s talk</h1>
              <span className="contactPage__email">{EMAIL}</span>
            </div>

            <p className="contactPage__lead">
              A question about something I&apos;ve written, an idea you&apos;d
              like to collaborate on, or just a general hello. This is the best
              place to reach me. For roles and recruiting, LinkedIn is better.
            </p>

            {replyTo && (
              <div className="contactReply">
                <div>
                  <div className="contactReply__eyebrow">Replying about</div>
                  <Link
                    className="contactReply__title"
                    to={itemPath(replyTo.frontmatter.slug)}
                  >
                    {replyTo.frontmatter.title}
                  </Link>
                  <div className="contactReply__note">
                    A link to this post will be included with your message.
                  </div>
                </div>
                <button
                  className="contactReply__remove"
                  onClick={() => setDismissed(true)}
                  type="button"
                >
                  Remove ✕
                </button>
              </div>
            )}

            <ContactForm
              aboutSlug={replyTo ? replyTo.frontmatter.slug : null}
              aboutTitle={replyTo ? replyTo.frontmatter.title : null}
              email={EMAIL}
            />
          </div>

          <aside className="rightRail contactElsewhere">
            <div className="railHeading">Elsewhere</div>
            <ElsewhereLinks />
          </aside>
        </div>
      </div>
    </Layout>
  );
};

ContactPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object,
};

export default ContactPage;

export const contactPageQuery = graphql`
  query contactPageQuery {
    site {
      siteMetadata {
        title
        description
        siteUrl
      }
    }
    allMdx(
      filter: {
        fields: {sourceInstanceName: {eq: "blog"}, visible: {eq: true}}
      }
    ) {
      nodes {
        frontmatter {
          slug
          title
        }
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
        description={DESCRIPTION}
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
      />
    </>
  );
};
