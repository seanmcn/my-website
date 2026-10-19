import {excerpt, getLibraryItems, getProjects} from '../lib/library.js';

/*
 * The site as llmstxt.org describes it: a Markdown index for language models,
 * with a title, a one-line summary and lists of links. Notes and finds go
 * under "Optional", the section the format says a reader can skip.
 */

const oneLine = text => text.replace(/\s+/g, ' ').trim();

function linkList(entries, site) {
  return entries.map(({title, path, description}) =>
    `- [${title}](${new URL(path, site)})` +
      (description ? `: ${oneLine(description)}` : ''),
  ).join('\n');
}

export async function GET({site}) {
  const items = await getLibraryItems();
  const projects = await getProjects();

  const ofType = type => items
      .filter(item => item.data.type === type)
      .map(item => ({
        title: item.data.title,
        path: `/library/${item.data.slug}/`,
        description: item.data.summary || excerpt(item, 160),
      }));

  const sections = [
    ['Pages', [
      {title: 'About', path: '/about/',
        description: 'Who Seán is and where he has worked.'},
      {title: 'Library', path: '/library/',
        description: 'Every post, note and find, newest first.'},
      {title: 'Projects', path: '/projects/',
        description: 'Things Seán has built.'},
      {title: 'Contact', path: '/contact/'},
      {title: 'RSS feed', path: '/rss.xml',
        description: 'The whole library, with full text.'},
    ]],
    ['Posts', ofType('post')],
    ['Projects', projects.map(project => ({
      title: project.data.title,
      path: `/projects/${project.data.slug}/`,
      description: project.data.summary || excerpt(project, 160),
    }))],
    ['Optional', [...ofType('note'), ...ofType('find')]],
  ];

  const body = [
    '# Seán McNamara',
    '> Personal website of Seán McNamara, Head of Engineering at Axiom ' +
      'Maths in London: articles on programming, technology, games and ' +
      'reviews, plus short notes and links to things worth reading.',
    ...sections.map(([heading, entries]) =>
      `## ${heading}\n\n${linkList(entries, site)}`),
  ].join('\n\n');

  return new Response(`${body}\n`, {
    headers: {'Content-Type': 'text/plain; charset=utf-8'},
  });
}
