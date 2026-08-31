import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'gatsby';
import Layout from '../components/layout/layout';
import ElsewhereLinks from '../components/elsewhere/elsewhereLinks';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import useCondensedHeader from '../hooks/useCondensedHeader';
import portrait from '../assets/images/portrait-transparent.png';
import './about.scss';

const DESCRIPTION = 'Learn more about Seán McNamara, Head of Engineering at ' +
  'Axiom Maths, with a background in backend platforms, product engineering, ' +
  'and AI-assisted workflows.';

const SNAPSHOT = [
  {label: 'Location', value: 'London, UK'},
  {
    label: 'Outside work',
    value: 'Drawing, films, Brazilian Jiu-Jitsu, travelling, and video games',
  },
  {label: 'Exploring', value: 'AI-assisted development'},
];

/*
 * Three levels of familiarity, shown as three weights: filled for daily, tinted
 * for often, outlined for things shipped but not lived in.
 */
const TOOLS = [
  {level: 'daily', name: 'Python'},
  {level: 'daily', name: 'PHP'},
  {level: 'daily', name: 'SQL'},
  {level: 'often', name: 'JavaScript'},
  {level: 'often', name: 'React'},
  {level: 'often', name: 'Vue'},
  {level: 'often', name: 'Bash'},
  {level: 'often', name: 'Golang'},
  {level: 'shipped', name: 'Flutter'},
  {level: 'shipped', name: 'Swift'},
  {level: 'shipped', name: 'C#'},
  {level: 'shipped', name: 'Unity'},
  {level: 'shipped', name: 'Godot'},
  {level: 'shipped', name: 'Java'},
];

const SECTIONS = [
  {
    heading: 'How It Started',
    paras: [
      'I got started the same way a lot of web developers did: tinkering ' +
        'with HTML and CSS, then gradually moving into PHP. That early mix ' +
        'of curiosity and experimentation gave me a solid grounding in how ' +
        'the web works from the ground up.',
      'My professional career began in Kilkenny, Ireland, where I worked as ' +
        'a freelance developer on WordPress sites, custom plugins, themes, ' +
        'and e-commerce projects. It was a great introduction to both ' +
        'shipping real work and collaborating closely with clients to turn ' +
        'rough ideas into useful products.',
    ],
  },
  {
    heading: 'Where It Went Next',
    paras: [
      'The next chapter took me to Canada, where I joined the University of ' +
        'British Columbia\'s Library IT Services. Working there sharpened ' +
        'both my technical skills and my ability to communicate clearly ' +
        'with different kinds of stakeholders.',
      'After that, I spent several years at Kobas, working deeply in ' +
        'hospitality technology. That experience broadened my understanding ' +
        'of product development in a fast-moving, operationally complex ' +
        'sector and gave me the chance to work across a wide range of ' +
        'systems and challenges.',
      'After that, I worked at Bumble, where I was part of the backend ' +
        'platform behind recommendations and discovery. That gave me ' +
        'experience working on large-scale distributed systems serving a ' +
        'global product, and added another layer to how I think about ' +
        'reliability, performance, and engineering at scale.',
    ],
  },
  {
    heading: 'Where I Am Now',
    paras: [
      'I\'ve recently joined Axiom Maths as Head of Engineering. Axiom Maths ' +
        'partners with schools across England and Wales to help young ' +
        'people with the aptitude and appetite for maths realise their ' +
        'potential.',
      'My focus is building the technology that lets the organisation scale ' +
        'its impact: dependable systems, thoughtful tooling for our teams, ' +
        'and infrastructure that supports the curriculum, coaching, and ' +
        'operations behind the programmes. It\'s the most mission-driven ' +
        'work I’ve done, and a good place to put a decade of engineering ' +
        'experience to use.',
    ],
  },
  {
    heading: 'What I\'m Exploring Now',
    paras: [
      'Alongside the day job, I\'ve been spending time with Golang, modern ' +
        'developer workflows, and AI tooling, especially Claude and Codex. ' +
        'I enjoy the mix of practical engineering and experimentation that ' +
        'comes with working in that space, and looking for ways to bring it ' +
        'back into how teams I work with ship software.',
    ],
  },
  {
    heading: 'What Keeps Me Interested',
    paras: [
      'I\'m still most interested in building useful things, learning new ' +
        'tools, and staying connected to open source. My toolkit spans PHP, ' +
        'Python, JavaScript, and Go, and I like working wherever solid ' +
        'engineering, thoughtful product decisions, and good developer ' +
        'experience overlap.',
    ],
  },
];

// Newest first in the rail, so the current role reads before the history.
const TIMELINE = [
  {
    org: 'Axiom Maths',
    role: 'Head of Engineering',
    years: '2026 – Present',
  },
  {
    org: 'Bumble',
    role: 'Senior Backend Engineer',
    years: '2023 – 2025',
  },
  {
    org: 'KOBAS',
    role: 'Lead Software Engineer',
    years: '2016 – 2023',
  },
  {
    org: 'The University of British Columbia',
    role: 'Programmer Analyst',
    years: '2015 – 2016',
  },
  {
    org: 'Self-employed',
    role: 'Freelance',
    years: 'Where it started',
  },
];

const AboutPage = ({data}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const condensed = useCondensedHeader();

  return (
    <Layout>
      <RuntimeSeoSync
        description={DESCRIPTION}
        pathname="/about/"
        siteUrl={siteUrl}
        title={`About Me - ${siteTitle}`}
      />
      <div className="pageWrap aboutPage">
        <div className="aboutPage__cols">
          <aside className="rail rail--bio aboutBio">
            <span className="aboutBio__portraitFrame">
              <span
                className={`aboutBio__portrait ${
                  condensed ? 'is-condensed' : ''
                }`}
              >
                <img alt="Seán McNamara" src={portrait} />
              </span>
            </span>

            <div>
              <div className="eyebrow">About</div>
              <p className="aboutBio__blurb">
                Backend engineer, now leading engineering at a maths charity.
              </p>
            </div>

            <div>
              {SNAPSHOT.map(row => (
                <div className="aboutBio__snapshot" key={row.label}>
                  <span className="aboutBio__snapshotLabel">{row.label}</span>
                  <span className="aboutBio__snapshotValue">{row.value}</span>
                </div>
              ))}
            </div>

            <div>
              <div className="railHeading aboutBio__toolsHeading">
                Languages &amp; tools
              </div>
              <div className="aboutBio__tools">
                {TOOLS.map(tool => (
                  <span
                    className={`aboutBio__tool aboutBio__tool--${tool.level}`}
                    key={tool.name}
                  >
                    {tool.name}
                  </span>
                ))}
              </div>
              <div className="aboutBio__key">
                <span className="aboutBio__keyItem">
                  <span className="aboutBio__swatch aboutBio__swatch--daily" />
                  Daily
                </span>
                <span className="aboutBio__keyItem">
                  <span className="aboutBio__swatch aboutBio__swatch--often" />
                  Often
                </span>
                <span className="aboutBio__keyItem">
                  <span
                    className="aboutBio__swatch aboutBio__swatch--shipped"
                  />
                  Have shipped
                </span>
              </div>
            </div>
          </aside>

          <div className="aboutPage__main">
            <div className="stickyBar aboutPage__bar">
              <h1 className="aboutPage__title">A peek into my journey</h1>
            </div>

            <p className="aboutPage__lead">
              I&apos;m Head of Engineering at{' '}
              <a
                href="https://axiommaths.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Axiom Maths
              </a>
              , based in London, with a backend leaning and a long-running
              interest in practical tooling, clean product thinking, and
              shipping useful things. Day to day, I&apos;m leading the
              technical side of Axiom Maths&apos; mission to help more young
              people realise their mathematical potential, while continuing to
              explore AI-assisted development workflows with Claude and Codex.
            </p>

            {SECTIONS.map((section, index) => (
              <section className="aboutSection" key={section.heading}>
                <div className="aboutSection__head">
                  <span className="aboutSection__num">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="aboutSection__heading">{section.heading}</h2>
                </div>
                {section.paras.map(para => (
                  <p className="aboutSection__para" key={para.slice(0, 32)}>
                    {para}
                  </p>
                ))}
                {index < SECTIONS.length - 1 && (
                  <div className="aboutSection__divider" />
                )}
              </section>
            ))}
          </div>

          <aside className="rightRail aboutTimeline">
            <div>
              <div className="railHeading aboutTimeline__heading">
                Where I&apos;ve worked
              </div>
              {TIMELINE.map(entry => (
                <div className="aboutTimeline__entry" key={entry.org}>
                  <div className="aboutTimeline__years">{entry.years}</div>
                  <div className="aboutTimeline__role">{entry.role}</div>
                  <div className="aboutTimeline__org">{entry.org}</div>
                </div>
              ))}
            </div>
            <ElsewhereLinks />
          </aside>
        </div>
      </div>
    </Layout>
  );
};

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AboutPage;

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
