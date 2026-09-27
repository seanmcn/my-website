import {
  TYPE_ROUTES,
  getLibraryItems,
  getLibraryMeta,
  paginate,
} from './library.js';
import {LIBRARY_HEADINGS, slugToTitle} from '../utils/content.js';

const SITE_TITLE = 'Seán McNamara';
const normalise = value => (value || '').toString().trim().toLowerCase();

/*
 * Every paginated listing on the site, as one flat list of pages. The route
 * files pick out their own: page 1 lives at the listing's base address and
 * later pages under /page/N/, as gatsby-awesome-pagination laid them out.
 */
export async function getListings() {
  const items = await getLibraryItems();
  const {categories, tags} = await getLibraryMeta();
  const listings = [];

  const heading = (filter) => {
    const [title, blurb] = LIBRARY_HEADINGS[filter];
    return {title, blurb, description: blurb,
      pageTitle: `${title} - ${SITE_TITLE}`};
  };

  listings.push({
    kind: 'all',
    params: {},
    pages: paginate(items, '/library'),
    screen: {activeFilter: 'all', ...heading('all')},
  });

  Object.entries(TYPE_ROUTES).forEach(([type, route]) => {
    listings.push({
      kind: 'type',
      params: {type: route},
      // A type with nothing in it still gets a page, so the filter bar never
      // links into a 404 while a kind of writing awaits its first entry.
      pages: paginate(items.filter(item => item.data.type === type),
          `/library/${route}`),
      screen: {activeFilter: type, ...heading(type)},
    });
  });

  tags.forEach(({name}) => {
    const display = slugToTitle(name);

    listings.push({
      kind: 'tag',
      params: {tag: normalise(name)},
      pages: paginate(items.filter(item => item.data.tags.includes(name)),
          `/library/tags/${normalise(name)}`),
      screen: {
        activeTag: name,
        title: display,
        blurb: `Everything tagged ${display}.`,
        description: `Browse everything tagged ${display} on Sean ` +
          'McNamara\'s site.',
        pageTitle: `${display} - Tag - ${SITE_TITLE}`,
      },
    });
  });

  categories.forEach(({name}) => {
    const display = slugToTitle(name);

    listings.push({
      kind: 'category',
      params: {category: name},
      pages: paginate(items.filter(item => item.data.category === name),
          `/library/categories/${name}`),
      screen: {
        activeCategory: name,
        title: display,
        blurb: `Everything filed under ${display}: posts, notes and finds.`,
        description: `Browse everything in the ${display} category on Sean ` +
          'McNamara\'s site.',
        pageTitle: `${display} - Category - ${SITE_TITLE}`,
      },
    });
  });

  return listings;
}

/* getStaticPaths for one kind of listing, either its first or later pages. */
export async function listingPaths(kind, {laterPages = false} = {}) {
  const listings = (await getListings()).filter(entry => entry.kind === kind);

  return listings.flatMap(({params, pages, screen}) => pages
      .filter(page => (laterPages ? page.number > 1 : page.number === 1))
      .map(page => ({
        params: laterPages ? {...params, page: String(page.number)} : params,
        props: {...screen, page},
      })));
}
