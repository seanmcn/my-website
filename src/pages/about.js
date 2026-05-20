import React from 'react';
import {graphql} from 'gatsby';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import './about.scss';

export default class AboutPage extends React.Component {
  render() {
    const {
      title: siteTitle,
      siteUrl,
    } = this.props.data.site.siteMetadata;
    const description = 'Learn more about Seán McNamara, Head of Engineering at Axiom Maths, with a background in backend platforms, product engineering, and AI-assisted workflows.';

    return (
      <Layout>
        <RuntimeSeoSync
          title={`About Me - ${siteTitle}`}
          description={description}
          pathname="/about/"
          siteUrl={siteUrl}
        />
        <div className="aboutPage">
          <section className="aboutHero box">
            <div className="aboutHeroContent">
              <div className="aboutHeroIntro">
                <div className="aboutHeroEyebrow">About</div>
                <h1 className="title aboutHeroTitle">A Peek Into My Journey</h1>
                <p className="aboutHeroLead">
                  I&apos;m Head of Engineering at <a href="https://axiommaths.com" target="_blank" rel="noopener noreferrer">Axiom Maths</a>,
                  based in London, with a backend leaning and a long-running
                  interest in practical tooling, clean product thinking, and
                  shipping useful things.
                </p>
                <p className="aboutHeroLead aboutHeroLeadSecondary">
                  Day to day, I&apos;m leading the technical side of Axiom
                  Maths&apos; mission to help more young people realise their
                  mathematical potential, while continuing to explore
                  AI-assisted development workflows with Claude and Codex.
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
                    <dd>Head of Engineering, Axiom Maths</dd>
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
                    <dd>Building engineering at Axiom Maths</dd>
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
                    After that, I worked at Bumble, where I was part of the
                    backend platform behind recommendations and discovery. That
                    gave me experience working on large-scale distributed
                    systems serving a global product, and added another layer
                    to how I think about reliability, performance, and
                    engineering at scale.
                  </p>
                  <h2>Where I Am Now</h2>
                  <p>
                    I&apos;ve recently joined <a href="https://axiommaths.com" target="_blank" rel="noopener noreferrer">Axiom Maths</a> as
                    Head of Engineering. Axiom Maths partners with schools
                    across England and Wales to help young people with the
                    aptitude and appetite for maths realise their potential.
                  </p>
                  <p>
                    My focus is building the technology that lets the
                    organisation scale its impact: dependable systems,
                    thoughtful tooling for our teams, and infrastructure that
                    supports the curriculum, coaching, and operations behind
                    the programmes. It&apos;s the most mission-driven work
                    I&apos;ve done, and a good place to put a decade of
                    engineering experience to use.
                  </p>
                  <h2>What I&apos;m Exploring Now</h2>
                  <p>
                    Alongside the day job, I&apos;ve been spending time with
                    Golang, modern developer workflows, and AI tooling,
                    especially Claude and Codex. I enjoy the mix of practical
                    engineering and experimentation that comes with working in
                    that space, and looking for ways to bring it back into how
                    teams I work with ship software.
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
                    <strong>Head of Engineering</strong>
                    <span className="aboutTimelineMeta">
                      Axiom Maths · 2026 - Present
                    </span>
                    <span className="aboutTimelineMeta">
                      London, England
                    </span>
                    <span>
                      Leading engineering for a charity helping young people
                      across England and Wales realise their mathematical
                      potential, building the technology behind the
                      programmes, partnerships, and operations.
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
  const title = `About Me - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        title={title}
        description="Learn more about Seán McNamara, Head of Engineering at Axiom Maths, with a background in backend platforms, product engineering, and AI-assisted workflows."
        siteTitle={siteTitle}
        siteDescription={siteDescription}
        siteUrl={siteUrl}
        pathname={location.pathname}
      />
    </>
  );
};
