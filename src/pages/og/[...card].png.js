import path from 'node:path';
import matter from 'gray-matter';
import {
  getLibraryItems,
  getLibraryMeta,
  getProjects,
  readingTimeMinutes,
} from '../../lib/library.js';
import {
  PORTRAIT,
  TYPE_COLOUR,
  itemCard,
  pageCard,
  posePath,
} from '../../lib/social-cards.js';
import {formatItemDate, readTimeLabel, typeMeta} from '../../utils/content.js';

/*
 * Every social card, at /og/<name>.png. Pages point at theirs through
 * Layout's `image` prop; anything that doesn't gets the home card.
 */

/*
 * The featured image's file, if there is one. The validated entry only holds
 * the built asset, so read the path from the frontmatter, relative to the
 * entry.
 */
function featuredFile(entry) {
  const {featured} = matter.read(entry.filePath).data;

  return featured && path.resolve(path.dirname(entry.filePath), featured);
}

const plural = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;

export async function getStaticPaths() {
  const [items, {counts}, projects] = await Promise.all([
    getLibraryItems(),
    getLibraryMeta(),
    getProjects(),
  ]);
  // December's builds swap the wave for the Santa hat.
  const homePose = new Date().getMonth() === 11 ? 'santa' : 'wave';

  const pages = {
    'home': {
      crumbs: ['seanmcn.com'],
      title: 'Seán McNamara',
      sub: 'Software engineering & other rabbit holes',
      lead: 'I build things, pull them apart, and try to make them better.',
      art: posePath(homePose),
    },
    'library': {
      crumbs: ['seanmcn.com', 'library'],
      title: 'Library',
      lead: 'Longer posts, short notes, and links worth passing on.',
      badges: ['post', 'note', 'find'].map(type => [
        plural(counts[type], typeMeta(type).label.toLowerCase()),
        TYPE_COLOUR[type],
      ]),
      art: posePath('thumbs-up'),
    },
    'projects': {
      crumbs: ['seanmcn.com', 'projects'],
      title: 'Projects',
      sub: plural(projects.length, 'project'),
      lead: 'Side projects, experiments, and tools I’ve enjoyed working on ' +
        'over the years.',
      art: posePath('cheer'),
    },
    'about': {
      crumbs: ['seanmcn.com', 'about'],
      title: 'About me',
      sub: 'Head of Engineering, Axiom Maths',
      lead: 'Backend engineer, now leading engineering at a maths charity.',
      art: PORTRAIT,
      artWidth: 420,
    },
    'contact': {
      crumbs: ['seanmcn.com', 'contact'],
      title: 'Let’s talk',
      sub: 'me@seanmcn.com · London',
      lead: 'A question about something I’ve written, an idea to work on ' +
        'together, or just hello.',
      art: posePath('beer'),
    },
    'subscribe': {
      crumbs: ['seanmcn.com', 'subscribe'],
      title: 'Subscribe',
      lead: 'An email whenever something new goes up, or the RSS feed.',
      art: posePath('thumbs-up'),
    },
    'not-found': {
      crumbs: ['seanmcn.com', '404'],
      title: 'Not found',
      lead: 'This one isn’t here. It never existed, or it moved and I ' +
        'missed a redirect.',
      art: posePath('confused'),
    },
  };

  return [
    ...Object.entries(pages).map(([card, spec]) => ({
      params: {card},
      props: {render: () => pageCard(spec)},
    })),
    ...items.map(item => ({
      params: {card: `library/${item.data.slug}`},
      props: {
        render: () => {
          const {data} = item;
          const readTime = data.type === 'find' ? '' :
            readTimeLabel(readingTimeMinutes(item.body));

          return itemCard({
            crumbs: ['seanmcn.com', 'library', data.category].filter(Boolean),
            label: typeMeta(data.type).label,
            colour: TYPE_COLOUR[data.type],
            meta: [formatItemDate(data.date), readTime]
                .filter(Boolean).join(' · '),
            title: data.title,
            summary: data.summary,
            art: featuredFile(item) || posePath('wave'),
          });
        },
      },
    })),
    ...projects.map(project => ({
      params: {card: `projects/${project.data.slug}`},
      props: {
        render: () => {
          // Project images are screenshots, so they sit in a frame.
          const screenshot = featuredFile(project);

          return itemCard({
            crumbs: ['seanmcn.com', 'projects'],
            label: 'Project',
            colour: TYPE_COLOUR.project,
            meta: [project.data.language, project.data.date.getUTCFullYear()]
                .filter(Boolean).join(' · '),
            title: project.data.title,
            summary: project.data.summary,
            art: screenshot || posePath('wave'),
            framed: Boolean(screenshot),
          });
        },
      },
    })),
  ];
}

export async function GET({props}) {
  return new Response(await props.render(), {
    headers: {'Content-Type': 'image/png'},
  });
}
