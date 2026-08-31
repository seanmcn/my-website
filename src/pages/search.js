import React from 'react';
import PropTypes from 'prop-types';
import {graphql, navigate} from 'gatsby';
import Fuse from 'fuse.js';
import Layout from '../components/layout/layout';
import SEO from '../components/seo/seo';
import RuntimeSeoSync from '../components/seo/runtimeSeoSync';
import SearchRow from '../components/search/searchRow';
import {CategoryIcon} from '../components/icons/icons';
import {slugToTitle, TYPE_META} from '../utils/content';
import './search.scss';

const TYPE_FACETS = [
  {key: 'everything', label: 'Everything'},
  {key: 'post', label: 'Post'},
  {key: 'note', label: 'Note'},
  {key: 'find', label: 'Find'},
  {key: 'project', label: 'Project'},
];

const SCOPES = [
  {key: 'title', label: 'Title'},
  {key: 'summary', label: 'Summary'},
  {key: 'full', label: 'Full text'},
];

const FUSE_KEYS = {
  title: [{name: 'title', weight: 5}],
  summary: [
    {name: 'excerpt', weight: 3},
    {name: 'keywords', weight: 2.5},
    {name: 'tags', weight: 2},
    {name: 'category', weight: 1.5},
  ],
  full: [
    {name: 'headings', weight: 2},
    {name: 'bodyPlainText', weight: 1.5},
  ],
};

const RECENT_KEY = 'seanmcn-recent-searches';

function typeColour(kind) {
  return TYPE_META[kind]?.colour || 'var(--ink-2)';
}

/*
 * A whole screen rather than a modal. Search is how the library is actually
 * navigated once there are a few hundred items, so it gets the same rail of
 * facets every other library view has.
 */
const SearchPage = ({data, location}) => {
  const {title: siteTitle, siteUrl} = data.site.siteMetadata;
  const [index, setIndex] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [type, setType] = React.useState('everything');
  const [category, setCategory] = React.useState(null);
  const [scope, setScope] = React.useState({
    title: true,
    summary: true,
    full: false,
  });
  const [recents, setRecents] = React.useState([]);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    fetch('/search-index.json')
        .then(response => response.json())
        .then(setIndex)
        .catch(() => setIndex([]));

    try {
      setRecents(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'));
    } catch (error) {
      setRecents([]);
    }

    inputRef.current?.focus();
  }, []);

  // ?q= lets a search be linked to, and survives a reload.
  React.useEffect(() => {
    const initial = new URLSearchParams(location?.search || '').get('q');

    if (initial) {
      setQuery(initial);
    }
  }, [location?.search]);

  const rememberSearch = React.useCallback((value) => {
    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return;
    }

    setRecents((previous) => {
      const next = [trimmed, ...previous.filter(item => item !== trimmed)]
          .slice(0, 4);

      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch (error) {
        // A private window without storage is not worth failing over.
      }

      return next;
    });
  }, []);

  const activeKeys = React.useMemo(
      () => SCOPES
          .filter(candidate => scope[candidate.key])
          .flatMap(candidate => FUSE_KEYS[candidate.key]),
      [scope],
  );

  const matched = React.useMemo(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      return index.slice(0, 6);
    }

    if (!activeKeys.length) {
      return [];
    }

    const fuse = new Fuse(index, {
      keys: activeKeys,
      threshold: 0.26,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    return fuse.search(trimmed).map(result => result.item);
  }, [activeKeys, index, query]);

  const inType = item => type === 'everything' || item.kind === type;
  const inCategory = item => !category || item.category === category;
  const rows = matched.filter(item => inType(item) && inCategory(item));
  const typePool = matched.filter(inCategory);
  const categoryPool = matched.filter(inType);

  const categoryCounts = categoryPool.reduce((counts, item) => {
    if (!item.category || item.kind === 'project') {
      return counts;
    }

    return {...counts, [item.category]: (counts[item.category] || 0) + 1};
  }, {});

  const tagCounts = rows.reduce((counts, item) => {
    (item.tags || []).forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });

    return counts;
  }, {});
  const topTags = Object.keys(tagCounts)
      .sort((left, right) => tagCounts[right] - tagCounts[left])
      .slice(0, 5);

  const toggleScope = key => setScope((previous) => {
    const next = {...previous, [key]: !previous[key]};

    // At least one scope must stay on, or every query returns nothing.
    return Object.values(next).some(Boolean) ? next : previous;
  });

  const highlight = (text) => {
    const trimmed = query.trim();

    if (!trimmed || !text) {
      return text;
    }

    const at = text.toLowerCase().indexOf(trimmed.toLowerCase());

    if (at < 0) {
      return text;
    }

    return (
      <>
        {text.slice(0, at)}
        <mark className="searchPage__hit">
          {text.slice(at, at + trimmed.length)}
        </mark>
        {text.slice(at + trimmed.length)}
      </>
    );
  };

  return (
    <Layout>
      <RuntimeSeoSync
        description="Search posts, notes, finds and projects."
        pathname="/search/"
        siteUrl={siteUrl}
        title={`Search - ${siteTitle}`}
      />
      <div className="pageWrap searchPage">
        <div className="twoCol">
          <button
            aria-expanded={filtersOpen}
            className={`railToggle ${filtersOpen ? 'is-open' : ''}`}
            onClick={() => setFiltersOpen(open => !open)}
            type="button"
          >
            {filtersOpen ? 'Hide filters ✕' : 'Filters ▾'}
          </button>

          <aside
            className={`rail rail--collapsible ${filtersOpen ? 'is-open' : ''}`}
          >
            <div>
              <div className="railHeading searchPage__facetHeading">Type</div>
              {TYPE_FACETS.map((facet) => {
                const count = facet.key === 'everything' ?
                  typePool.length :
                  typePool.filter(item => item.kind === facet.key).length;
                const active = type === facet.key;

                return (
                  <button
                    className={`searchFacet ${active ? 'is-active' : ''}`}
                    key={facet.key}
                    onClick={() =>
                      setType(active ? 'everything' : facet.key)
                    }
                    type="button"
                  >
                    <span className="searchFacet__name">
                      {facet.key !== 'everything' && (
                        <span
                          className="searchFacet__dot"
                          style={{
                            background: facet.key === 'project' ?
                              'var(--accent)' :
                              typeColour(facet.key),
                          }}
                        />
                      )}
                      {facet.label}
                    </span>
                    <span className="searchFacet__count">{count}</span>
                  </button>
                );
              })}
            </div>

            {Object.keys(categoryCounts).length > 0 && (
              <div>
                <div className="railHeading searchPage__facetHeading">
                  Category
                </div>
                {Object.keys(categoryCounts).sort().map(name => (
                  <button
                    className={`searchFacet searchFacet--bordered ${
                      category === name ? 'is-active' : ''
                    }`}
                    key={name}
                    onClick={() =>
                      setCategory(category === name ? null : name)
                    }
                    type="button"
                  >
                    <span className="searchFacet__name">
                      <CategoryIcon size={13} />
                      {slugToTitle(name)}
                    </span>
                    <span className="searchFacet__count">
                      {categoryCounts[name]}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {topTags.length > 0 && (
              <div className="railBlock">
                <div className="railBlock__label searchPage__facetHeading">
                  Related tags
                </div>
                <div className="searchPage__tags">
                  {topTags.map(tag => (
                    <button
                      className="searchPage__tag"
                      key={tag}
                      onClick={() => setQuery(tag)}
                      type="button"
                    >
                      {slugToTitle(tag)} {tagCounts[tag]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {recents.length > 0 && (
              <div>
                <div className="railHeading searchPage__facetHeading">
                  Recent searches
                </div>
                <div className="searchPage__recents">
                  {recents.map(recent => (
                    <button
                      className="searchPage__recent"
                      key={recent}
                      onClick={() => setQuery(recent)}
                      type="button"
                    >
                      {recent}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <div>
            <div className="searchPage__field">
              <span aria-hidden="true" className="searchPage__glyph">⌕</span>
              <label className="visually-hidden" htmlFor="search-input">
                Search posts, notes, finds and projects
              </label>
              <input
                autoComplete="off"
                className="searchPage__input"
                id="search-input"
                onChange={event => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    rememberSearch(query);
                  }
                }}
                placeholder="Search posts, notes, finds, projects…"
                ref={inputRef}
                type="search"
                value={query}
              />
              <span className="searchPage__count">
                {rows.length} {rows.length === 1 ? 'result' : 'results'}
              </span>
              {query && (
                <button
                  className="searchPage__clear"
                  onClick={() => {
                    setQuery('');
                    setType('everything');
                    setCategory(null);
                    inputRef.current?.focus();
                  }}
                  type="button"
                >
                  Clear ✕
                </button>
              )}
            </div>

            <div className="searchPage__scopes">
              <span className="searchPage__scopesLabel">Match in</span>
              {SCOPES.map(candidate => (
                <button
                  className={`searchPage__scope ${
                    scope[candidate.key] ? 'is-active' : ''
                  }`}
                  key={candidate.key}
                  onClick={() => toggleScope(candidate.key)}
                  type="button"
                >
                  {candidate.label}
                </button>
              ))}
            </div>

            <div className="searchPage__results">
              {rows.map(item => (
                <SearchRow
                  highlight={highlight}
                  item={item}
                  key={item.path}
                  onOpen={() => {
                    rememberSearch(query);
                    navigate(item.path);
                  }}
                />
              ))}

              {rows.length === 0 && (
                <div className="libraryEmpty">
                  <div className="libraryEmpty__title">
                    Nothing matched that
                  </div>
                  <p className="libraryEmpty__body">
                    Try a shorter word, widen the type filter, or turn on full
                    text under Match in.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

SearchPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object,
};

export default SearchPage;

export const searchPageQuery = graphql`
  query searchPageQuery {
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
  const title = `Search - ${siteTitle}`;

  return (
    <>
      <title>{title}</title>
      <SEO
        description="Search posts, notes, finds and projects."
        noIndex
        pathname={location.pathname}
        siteDescription={siteDescription}
        siteTitle={siteTitle}
        siteUrl={siteUrl}
        title={title}
      />
    </>
  );
};
