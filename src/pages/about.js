import React from 'react';
import {graphql} from 'gatsby';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import './about.scss';

export default class AboutPage extends React.Component {
  render() {
    return (
      <Layout>
        <div className="aboutPage">
          <section className="aboutHero box">
            <div className="aboutHeroContent">
              <div className="aboutHeroIntro">
                <div className="aboutHeroEyebrow">About</div>
                <h1 className="title aboutHeroTitle">A Peek Into My Journey</h1>
                <p className="aboutHeroLead">
                  I&apos;m a software engineer based in London, with a backend
                  leaning and a long-running interest in practical tooling,
                  clean product thinking, and shipping useful things.
                </p>
                <p className="aboutHeroLead aboutHeroLeadSecondary">
                  Right now I&apos;m focused on finding my next role while
                  exploring AI-assisted development workflows, especially with
                  Claude and Codex, and thinking more seriously about where I
                  want to grow next.
                </p>
              </div>

              <div className="aboutSnapshotShell">
                <h2 className="aboutSectionTitle">Snapshot</h2>
                <dl className="aboutSnapshotGrid">
                  <div className="aboutSnapshotItem">
                    <dt>
                      <span className="aboutSnapshotIcon">
                        <FontAwesomeIcon icon={icon({name: 'code-branch'})} />
                      </span>
                      <span>Role</span>
                    </dt>
                    <dd>Software Engineer</dd>
                  </div>
                  <div className="aboutSnapshotItem">
                    <dt>
                      <span className="aboutSnapshotIcon">
                        <FontAwesomeIcon icon={icon({name: 'location-dot'})} />
                      </span>
                      <span>Location</span>
                    </dt>
                    <dd>London, UK</dd>
                  </div>
                  <div className="aboutSnapshotItem">
                    <dt>
                      <span className="aboutSnapshotIcon">
                        <FontAwesomeIcon icon={icon({name: 'crosshairs'})} />
                      </span>
                      <span>Current Focus</span>
                    </dt>
                    <dd>Finding a new role</dd>
                  </div>
                  <div className="aboutSnapshotItem">
                    <dt>
                      <span className="aboutSnapshotIcon">
                        <FontAwesomeIcon icon={icon({name: 'layer-group'})} />
                      </span>
                      <span>Main Stack</span>
                    </dt>
                    <dd>Golang / Python / PHP</dd>
                  </div>
                  <div className="aboutSnapshotItem">
                    <dt>
                      <span className="aboutSnapshotIcon">
                        <FontAwesomeIcon icon={icon({name: 'palette'})} />
                      </span>
                      <span>Outside Work</span>
                    </dt>
                    <dd>
                      Drawing, films, Brazilian Jiu-Jitsu, travelling, and
                      video games
                    </dd>
                  </div>
                  <div className="aboutSnapshotItem">
                    <dt>
                      <span className="aboutSnapshotIcon">
                        <FontAwesomeIcon icon={icon({name: 'wand-magic-sparkles'})} />
                      </span>
                      <span>Exploring</span>
                    </dt>
                    <dd>Claude/Codex workflows and AI in general</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>

          <div className="aboutPageGrid">
            <div className="aboutPageMain">
              <div className="box aboutStoryCard">
                <div className="content aboutStoryContent">
                  <h2>How It Started</h2>
                  <p>
                    I got started the same way a lot of web developers did:
                    tinkering with HTML and CSS, then gradually moving into
                    PHP. That early mix of curiosity and experimentation gave
                    me a solid grounding in how the web works from the ground
                    up.
                  </p>
                  <p>
                    My professional career began in Kilkenny, Ireland, where I
                    worked as a freelance developer on WordPress sites, custom
                    plugins, themes, and e-commerce projects. It was a great
                    introduction to both shipping real work and collaborating
                    closely with clients to turn rough ideas into useful
                    products.
                  </p>
                  <h2>Where It Went Next</h2>
                  <p>
                    The next chapter took me to Canada, where I joined the
                    University of British Columbia&apos;s Library IT Services.
                    Working there sharpened both my technical skills and my
                    ability to communicate clearly with different kinds of
                    stakeholders.
                  </p>
                  <p>
                    After that, I spent several years at Kobas, working deeply
                    in hospitality technology. That experience broadened my
                    understanding of product development in a fast-moving,
                    operationally complex sector and gave me the chance to work
                    across a wide range of systems and challenges.
                  </p>
                  <p>
                    More recently, I worked at Bumble, where I was part of the
                    backend platform behind recommendations and discovery. That
                    gave me experience working on large-scale distributed
                    systems serving a global product, and added another layer
                    to how I think about reliability, performance, and
                    engineering at scale.
                  </p>
                  <h2>What I&apos;m Exploring Now</h2>
                  <p>
                    Lately, I&apos;ve been spending more time with Golang,
                    modern developer workflows, and AI tooling, especially GPT
                    integrations and coding assistants. I enjoy the mix of
                    practical engineering and experimentation that comes with
                    working in that space.
                  </p>
                  <h2>What Keeps Me Interested</h2>
                  <p>
                    I&apos;m still most interested in building useful things,
                    learning new tools, and staying connected to open source.
                    My toolkit spans PHP, Python, JavaScript, and Go, and I
                    like working wherever solid engineering, thoughtful product
                    decisions, and good developer experience overlap.
                  </p>
                </div>
              </div>
            </div>

            <aside className="aboutPageAside">
              <div className="box aboutTimelineCard">
                <h2 className="aboutSectionTitle">Timeline</h2>
                <ol className="aboutTimelineList">
                  <li>
                    <strong>Freelance</strong>
                    <span className="aboutTimelineMeta">
                      Early career · Kilkenny, Ireland
                    </span>
                    <span>
                      Early freelance development work across websites,
                      WordPress, and e-commerce projects.
                    </span>
                  </li>
                  <li>
                    <strong>Programmer Analyst</strong>
                    <span className="aboutTimelineMeta">
                      The University of British Columbia · 2015 - 2016
                    </span>
                    <span className="aboutTimelineMeta">
                      Vancouver, Canada
                    </span>
                    <span>
                      Backend engineer on the Open Collections project,
                      building APIs and search systems for large digital
                      research archives.
                    </span>
                  </li>
                  <li>
                    <strong>Lead Software Engineer</strong>
                    <span className="aboutTimelineMeta">
                      KOBAS · 2016 - 2023
                    </span>
                    <span className="aboutTimelineMeta">
                      London, England
                    </span>
                    <span>
                      Built and scaled SaaS and in-venue systems for
                      hospitality venues, including ordering, payments, and
                      customer engagement tools.
                    </span>
                  </li>
                  <li>
                    <strong>Senior Backend Engineer</strong>
                    <span className="aboutTimelineMeta">
                      Bumble · 2023 - 2025
                    </span>
                    <span className="aboutTimelineMeta">
                      London, England · Remote
                    </span>
                    <span>
                      Worked on the recommendations and discovery platform
                      powering user matching for a global dating app with tens
                      of millions of users.
                    </span>
                  </li>
                  <li>
                    <strong>TBD...</strong>
                    <span className="aboutTimelineMeta">
                      Next
                    </span>
                    <span>
                      Looking for the right next role, with a longer-term goal
                      of growing toward Head of Engineering.
                    </span>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </div>
      </Layout>
    );
  }
}

AboutPage.propTypes = {};

export const aboutPageQuery = graphql`
  query aboutPageQuery {
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

  return (
    <SEO
      title={`About Me - ${siteTitle}`}
      description="Learn more about Seán McNamara, a backend-focused software engineer in London with experience across product engineering, platforms, and AI-assisted workflows."
      siteTitle={siteTitle}
      siteDescription={siteDescription}
      siteUrl={siteUrl}
      pathname={location.pathname}
    />
  );
};
