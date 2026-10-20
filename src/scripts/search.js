import Fuse from 'fuse.js';
import {iconSvg} from '../components/icons/icons.js';
import {
  formatItemDate,
  slugToTitle,
  sourceHost,
  TYPE_META,
} from '../utils/content.js';

/*
 * The search screen. SearchScreen.astro renders the static shell; this keeps
 * one state object and redraws the counts, facets and results from it
 * whenever it changes. The index is a few hundred items, so redrawing
 * everything on each keystroke costs nothing worth optimising.
 */

export const TYPE_FACETS = [
  {key: 'everything', label: 'Everything'},
  {key: 'post', label: 'Post'},
  {key: 'note', label: 'Note'},
  {key: 'find', label: 'Find'},
  {key: 'project', label: 'Project'},
];

export const SCOPES = [
  {key: 'title', label: 'Title', on: true},
  {key: 'summary', label: 'Summary', on: true},
  {key: 'full', label: 'Full text', on: false},
];

const FUSE_KEYS = {
  title: [{name: 'title', weight: 5}],
  summary: [
    {name: 'excerpt', weight: 3},
    {name: 'tags', weight: 2},
    {name: 'category', weight: 1.5},
  ],
  full: [
    {name: 'headings', weight: 2},
    {name: 'bodyPlainText', weight: 1.5},
  ],
};

const KIND_LABEL = {
  post: 'Post',
  note: 'Note',
  find: 'Find',
  project: 'Project',
};

const RECENT_KEY = 'seanmcn-recent-searches';

export function typeColour(kind) {
  return kind === 'project' ?
    'var(--accent)' :
    TYPE_META[kind]?.colour || 'var(--ink-2)';
}

const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ENTITIES[char]);
}

function readRecents() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeRecents(recents) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recents));
  } catch {
    // A private window without storage is not worth failing over.
  }
}

function countBy(items, keysOf) {
  const counts = {};

  items.forEach((item) => {
    keysOf(item).forEach((key) => {
      counts[key] = (counts[key] || 0) + 1;
    });
  });

  return counts;
}

/*
 * Search results reuse the library row's shape but are built from the flat
 * JSON index rather than collection entries, so they carry no image and lean
 * on the hatched plate instead.
 */
function rowHtml(item, highlight) {
  const kind = item.kind || 'post';
  const colour = typeColour(kind);
  const isFind = kind === 'find';
  const isProject = kind === 'project';
  const image = item.thumb ?
    `<span class="item-row__thumb">` +
      `<img alt="" src="${escapeHtml(item.thumb)}"></span>` :
    `<span class="item-row__plate item-row__plate--${
      isFind ? 'find' : 'note'}">` +
      `<span class="item-row__plate-note">${escapeHtml(
          isFind ? sourceHost(item.source) || 'Link' : 'No image',
      )}</span></span>`;
  let time = '';

  if (isFind) {
    time = 'Link ↗';
  } else if (isProject) {
    time = 'Project ↗';
  } else if (item.readingTime > 0) {
    time = `${iconSvg('clock', {size: 11})}${item.readingTime} min`;
  }

  return [
    `<a class="item-row" data-type="${escapeHtml(kind)}" ` +
      `href="${escapeHtml(item.path)}">`,
    '<span class="item-row__thumb-col">',
    `<span class="item-row__spine" style="background: ${colour}"></span>`,
    image,
    `<span class="item-row__pill" style="background: ${colour}">`,
    `${KIND_LABEL[kind] || ''}</span>`,
    '</span>',
    item.category ?
      `<span class="item-row__category">${iconSvg('category')}${escapeHtml(
          isProject ? item.category : slugToTitle(item.category),
      )}</span>` :
      '',
    `<span class="item-row__title">${highlight(item.title)}</span>`,
    `<span class="item-row__excerpt">${highlight(item.excerpt)}</span>`,
    `<span class="item-row__date">${escapeHtml(
        item.dateDisplay || formatItemDate(item.date),
    )}</span>`,
    time ? `<span class="item-row__time">${time}</span>` : '',
    '</a>',
  ].join('');
}

/*
 * Replaces the [data-key] buttons in a container. If one of them had focus,
 * its replacement takes it, so a keyboard user clicking a facet stays put.
 */
function redrawButtons(container, html) {
  const focused = container.contains(document.activeElement) ?
    document.activeElement.dataset.key :
    null;

  container.querySelectorAll('[data-key]').forEach(button => button.remove());
  container.insertAdjacentHTML('beforeend', html);

  if (focused !== null) {
    [...container.querySelectorAll('[data-key]')]
        .find(button => button.dataset.key === focused)
        ?.focus();
  }
}

export function bindSearch(root) {
  const input = root.querySelector('#search-input');
  const count = root.querySelector('.search-page__count');
  const clear = root.querySelector('.search-page__clear');
  const results = root.querySelector('.search-page__results');
  const empty = results.querySelector('.library-empty');
  const typeButtons = root.querySelectorAll('.search-facet[data-type]');
  const scopeButtons = root.querySelectorAll('[data-scope]');
  const categories = root.querySelector('[data-categories]');
  const tags = root.querySelector('[data-tags]');
  const tagList = tags.querySelector('.search-page__tags');
  const recents = root.querySelector('[data-recents]');
  const recentList = recents.querySelector('.search-page__recents');

  const state = {
    index: null,
    // ?q= lets a search be linked to, and survives a reload.
    query: new URLSearchParams(window.location.search).get('q') || '',
    type: 'everything',
    category: null,
    scope: Object.fromEntries(SCOPES.map(scope => [scope.key, scope.on])),
    recents: readRecents(),
  };
  let fuse = null;
  let fuseKeys = '';

  const search = () => {
    const query = state.query.trim();

    if (!query) {
      return state.index.slice(0, 6);
    }

    const keys = SCOPES
        .filter(scope => state.scope[scope.key])
        .flatMap(scope => FUSE_KEYS[scope.key]);
    const signature = keys.map(key => key.name).join();

    if (signature !== fuseKeys) {
      fuse = new Fuse(state.index, {
        keys,
        threshold: 0.26,
        ignoreLocation: true,
        minMatchCharLength: 2,
      });
      fuseKeys = signature;
    }

    return fuse.search(query).map(result => result.item);
  };

  const highlight = (text) => {
    const query = state.query.trim();

    if (!text) {
      return '';
    }

    const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;

    if (at < 0) {
      return escapeHtml(text);
    }

    return escapeHtml(text.slice(0, at)) +
      '<mark class="search-page__hit">' +
      escapeHtml(text.slice(at, at + query.length)) +
      '</mark>' +
      escapeHtml(text.slice(at + query.length));
  };

  const render = () => {
    const loaded = state.index !== null;
    const matched = loaded ? search() : [];
    const inType = item => state.type === 'everything' ||
      item.kind === state.type;
    const inCategory = item => !state.category ||
      item.category === state.category;
    const rows = matched.filter(item => inType(item) && inCategory(item));
    const typePool = matched.filter(inCategory);
    const categoryCounts = countBy(
        matched.filter(inType),
        item => (item.category && item.kind !== 'project' ?
          [item.category] :
          []),
    );
    const tagCounts = countBy(rows, item => item.tags || []);
    const topTags = Object.keys(tagCounts)
        .sort((left, right) => tagCounts[right] - tagCounts[left])
        .slice(0, 5);
    const names = Object.keys(categoryCounts).sort();

    if (input.value !== state.query) {
      input.value = state.query;
    }

    count.textContent = loaded ?
      `${rows.length} ${rows.length === 1 ? 'result' : 'results'}` :
      '';
    clear.hidden = !state.query;

    typeButtons.forEach((button) => {
      const key = button.dataset.type;

      button.classList.toggle('is-active', state.type === key);
      button.querySelector('.search-facet__count').textContent =
        key === 'everything' ?
          typePool.length :
          typePool.filter(item => item.kind === key).length;
    });

    scopeButtons.forEach((button) => {
      button.classList.toggle('is-active', state.scope[button.dataset.scope]);
    });

    categories.hidden = names.length === 0;
    redrawButtons(categories, names.map(name => [
      `<button class="search-facet search-facet--bordered${
        state.category === name ? ' is-active' : ''}" ` +
        `data-key="${escapeHtml(name)}" type="button">`,
      `<span class="search-facet__name">${iconSvg('category', {size: 13})}`,
      `${escapeHtml(slugToTitle(name))}</span>`,
      `<span class="search-facet__count">${categoryCounts[name]}</span>`,
      '</button>',
    ].join('')).join(''));

    tags.hidden = topTags.length === 0;
    redrawButtons(tagList, topTags.map(tag => (
      `<button class="search-page__tag" data-key="${escapeHtml(tag)}" ` +
        `type="button">${escapeHtml(slugToTitle(tag))} ` +
        `${tagCounts[tag]}</button>`
    )).join(''));

    recents.hidden = state.recents.length === 0;
    redrawButtons(recentList, state.recents.map(recent => (
      `<button class="search-page__recent" data-key="${escapeHtml(recent)}" ` +
        `type="button">${escapeHtml(recent)}</button>`
    )).join(''));

    results.querySelectorAll('.item-row').forEach(row => row.remove());
    empty.insertAdjacentHTML(
        'beforebegin',
        rows.map(item => rowHtml(item, highlight)).join(''),
    );
    empty.hidden = !loaded || rows.length > 0;
  };

  const update = (changes) => {
    Object.assign(state, changes);
    render();
  };

  const rememberSearch = (value) => {
    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return;
    }

    state.recents = [
      trimmed,
      ...state.recents.filter(item => item !== trimmed),
    ].slice(0, 4);
    writeRecents(state.recents);
  };

  const onKey = (container, handler) => {
    container.addEventListener('click', (event) => {
      const button = event.target.closest('[data-key]');

      if (button) {
        handler(button.dataset.key);
      }
    });
  };

  input.addEventListener('input', () => update({query: input.value}));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      rememberSearch(state.query);
      render();
    }
  });

  clear.addEventListener('click', () => {
    update({query: '', type: 'everything', category: null});
    input.focus();
  });

  typeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.type;

      update({type: state.type === key ? 'everything' : key});
    });
  });

  scopeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const scope = {
        ...state.scope,
        [button.dataset.scope]: !state.scope[button.dataset.scope],
      };

      // At least one scope must stay on, or every query returns nothing.
      if (Object.values(scope).some(Boolean)) {
        update({scope});
      }
    });
  });

  onKey(categories, name => update({
    category: state.category === name ? null : name,
  }));
  onKey(tagList, tag => update({query: tag}));
  onKey(recentList, recent => update({query: recent}));

  // The row is a plain link, so this only records the search before the
  // browser follows it, and a modified click still opens a new tab.
  results.addEventListener('click', (event) => {
    if (event.target.closest('.item-row')) {
      rememberSearch(state.query);
    }
  });

  render();
  input.focus();

  fetch('/search-index.json')
      .then(response => response.json())
      .then((index) => {
        state.index = index;
      })
      .catch(() => {
        state.index = [];
      })
      .finally(render);
}
