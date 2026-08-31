/*
 * The library holds three kinds of item. A post is a full article, a note is a
 * short piece written in one sitting, and a find is a link worth passing on
 * with a line about why. They share taxonomy, search and the library index;
 * they differ in how much chrome the page around them earns.
 */

export const ITEM_TYPES = ['post', 'note', 'find'];

export const TYPE_META = {
  post: {
    colour: 'var(--plum)',
    hint: 'However long it needs to be',
    label: 'Post',
    plural: 'Posts',
    shape: 'circle',
  },
  note: {
    colour: 'var(--amber)',
    hint: '10-25 minutes to write',
    label: 'Note',
    plural: 'Notes',
    shape: 'diamond',
  },
  find: {
    colour: 'var(--blue)',
    hint: '2-5 minutes to write',
    label: 'Find',
    plural: 'Finds',
    shape: 'square',
  },
};

export const LIBRARY_FILTERS = [
  {key: 'all', label: 'All', path: '/library/'},
  {key: 'post', label: 'Posts', path: '/library/posts/'},
  {key: 'note', label: 'Notes', path: '/library/notes/'},
  {key: 'find', label: 'Finds', path: '/library/finds/'},
];

export const LIBRARY_HEADINGS = {
  all: [
    'Library',
    'Everything in one place: longer posts, short notes, and links worth ' +
      'passing on.',
  ],
  post: [
    'Posts',
    'Longer pieces on things I’ve thought about, worked on, or figured ' +
      'out.',
  ],
  note: [
    'Notes',
    'Smaller ideas, observations, and things I’ve learned along the way.',
  ],
  find: [
    'Finds',
    'Things I’ve come across worth passing on, with a note on why.',
  ],
};

export function normaliseType(type) {
  const candidate = (type || '').toString().trim().toLowerCase();

  return ITEM_TYPES.includes(candidate) ? candidate : 'post';
}

export function typeMeta(type) {
  return TYPE_META[normaliseType(type)];
}

export function itemPath(slug) {
  return `/library/${slug}/`;
}

export function categoryPath(category) {
  return `/library/categories/${category}/`;
}

export function tagPath(tag) {
  return `/library/tags/${tag}/`;
}

/*
 * A find's meta line is the host it points at, the way a citation would read.
 * Posts and notes show their category and how long they take to read.
 */
export function sourceHost(source) {
  if (!source) {
    return '';
  }

  try {
    return new URL(source).hostname.replace(/^www\./, '');
  } catch (error) {
    return source
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
  }
}

export function readTimeLabel(minutes) {
  if (!minutes) {
    return '';
  }

  return `${minutes} min read`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTHS_SHORT = MONTHS.map(month => month.slice(0, 3));

function toDate(value) {
  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/* "16 Aug 2026", the format the library rows and item headers use. */
export function formatItemDate(value) {
  const date = toDate(value);

  if (!date) {
    return '';
  }

  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]} ` +
    `${date.getUTCFullYear()}`;
}

/* "August 2026", used to group rows by month. */
export function formatMonthYear(value) {
  const date = toDate(value);

  if (!date) {
    return '';
  }

  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/* {day: "07", monthShort: "Aug"} for the home page's dated rails. */
export function formatDayMonth(value) {
  const date = toDate(value);

  if (!date) {
    return {day: '', monthShort: ''};
  }

  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    monthShort: MONTHS_SHORT[date.getUTCMonth()],
  };
}

export function formatLongDate(value) {
  const date = toDate(value);

  if (!date) {
    return '';
  }

  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ` +
    `${date.getUTCFullYear()}`;
}

/*
 * Slug case to display case, with the overrides that stop "PHP" reading as
 * "Php". Shared by categories, tags and series titles.
 */
const CAPITALISATION_OVERRIDE = {
  Ai: 'AI',
  Chatgpt: 'ChatGPT',
  Ci: 'CI',
  Css: 'CSS',
  Cms: 'CMS',
  Devops: 'DevOps',
  Gitlab: 'GitLab',
  Gpg: 'GPG',
  Ios: 'iOS',
  Jquery: 'jQuery',
  Letsencrypt: 'Let\'s Encrypt',
  Macos: 'macOS',
  Nginx: 'nginx',
  Nlp: 'NLP',
  Pear: 'PEAR',
  Php: 'PHP',
  Phpstorm: 'PHPStorm',
  Pyrocms: 'PyroCMS',
  Rss: 'RSS',
  Rts: 'RTS',
  Sms: 'SMS',
  Sql: 'SQL',
  Stashphp: 'StashPHP',
  Ui: 'UI',
  Url: 'URL',
  Uuid: 'UUID',
  Wakatime: 'WakaTime',
};

export function slugToTitle(value) {
  const words = (value || '').toString().toLowerCase().split('-');

  return words
      .map((word) => {
        const capitalised = word.charAt(0).toUpperCase() + word.substring(1);

        return CAPITALISATION_OVERRIDE[capitalised] || capitalised;
      })
      .join(' ');
}
