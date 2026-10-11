import React from 'react';
import Fuse from 'fuse.js';
import SearchRow from './searchRow.jsx';
import {CategoryIcon} from '../icons/icons.jsx';
import {slugToTitle, TYPE_META} from '../../utils/content.js';

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
 * facets every other library view has. Rendered as a React island: the page
 * around it is static, and the index loads from /search-index.json.
 */
const SearchScreen = () => {
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
    const initial = new URLSearchParams(window.location.search).get('q');

    if (initial) {
      setQuery(initial);
    }
  }, []);

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
        <mark className="search-page__hit">
          {text.slice(at, at + trimmed.length)}
        </mark>
        {text.slice(at + trimmed.length)}
      </>
    );
  };

  return (
    <div className="page-wrap search-page">
      <h1 className="visually-hidden">Search</h1>
      <div className="two-col">
        <button
          aria-expanded={filtersOpen}
          className={`rail-toggle ${filtersOpen ? 'is-open' : ''}`}
          onClick={() => setFiltersOpen(open => !open)}
          type="button"
        >
          {filtersOpen ? 'Hide filters ✕' : 'Filters ▾'}
        </button>

        <aside
          className={`rail rail--collapsible ${filtersOpen ? 'is-open' : ''}`}
        >
          <div>
            <div className="rail-heading search-page__facet-heading">Type</div>
            {TYPE_FACETS.map((facet) => {
              const count = facet.key === 'everything' ?
                  typePool.length :
                  typePool.filter(item => item.kind === facet.key).length;
              const active = type === facet.key;

              return (
                <button
                  className={`search-facet ${active ? 'is-active' : ''}`}
                  key={facet.key}
                  onClick={() =>
                    setType(active ? 'everything' : facet.key)
                  }
                  type="button"
                >
                  <span className="search-facet__name">
                    {facet.key !== 'everything' && (
                      <span
                        className="search-facet__dot"
                        style={{
                          background: facet.key === 'project' ?
                              'var(--accent)' :
                              typeColour(facet.key),
                        }}
                      />
                    )}
                    {facet.label}
                  </span>
                  <span className="search-facet__count">{count}</span>
                </button>
              );
            })}
          </div>

          {Object.keys(categoryCounts).length > 0 && (
            <div>
              <div className="rail-heading search-page__facet-heading">
                  Category
              </div>
              {Object.keys(categoryCounts).sort().map(name => (
                <button
                  className={`search-facet search-facet--bordered ${
                      category === name ? 'is-active' : ''
                  }`}
                  key={name}
                  onClick={() =>
                    setCategory(category === name ? null : name)
                  }
                  type="button"
                >
                  <span className="search-facet__name">
                    <CategoryIcon size={13} />
                    {slugToTitle(name)}
                  </span>
                  <span className="search-facet__count">
                    {categoryCounts[name]}
                  </span>
                </button>
              ))}
            </div>
          )}

          {topTags.length > 0 && (
            <div className="rail-block">
              <div className="rail-block__label search-page__facet-heading">
                  Related tags
              </div>
              <div className="search-page__tags">
                {topTags.map(tag => (
                  <button
                    className="search-page__tag"
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
              <div className="rail-heading search-page__facet-heading">
                  Recent searches
              </div>
              <div className="search-page__recents">
                {recents.map(recent => (
                  <button
                    className="search-page__recent"
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
          <div className="search-page__field">
            <span aria-hidden="true" className="search-page__glyph">⌕</span>
            <label className="visually-hidden" htmlFor="search-input">
                Search posts, notes, finds and projects
            </label>
            <input
              autoComplete="off"
              className="search-page__input"
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
            <span className="search-page__count">
              {rows.length} {rows.length === 1 ? 'result' : 'results'}
            </span>
            {query && (
              <button
                className="search-page__clear"
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

          <div className="search-page__scopes">
            <span className="search-page__scopes-label">Match in</span>
            {SCOPES.map(candidate => (
              <button
                className={`search-page__scope ${
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

          <div className="search-page__results">
            {rows.map(item => (
              <SearchRow
                highlight={highlight}
                item={item}
                key={item.path}
                onOpen={() => {
                  rememberSearch(query);
                  window.location.assign(item.path);
                }}
              />
            ))}

            {rows.length === 0 && (
              <div className="library-empty">
                <div className="library-empty__title">
                    Nothing matched that
                </div>
                <p className="library-empty__body">
                    Try a shorter word, widen the type filter, or turn on full
                    text under Match in.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
