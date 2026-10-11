/*
 * The 404 page's terminal. Amplify serves 404.html for any missing address, so
 * the page only learns what was asked for once it runs: it prints the path,
 * then guesses the closest pages from the search index, the way git suggests
 * a command when you mistype one.
 */

const MAX_SUGGESTIONS = 3;
const MIN_SCORE = 0.5;

const words = value => value.toLowerCase().split(/[^a-z0-9]+/)
    .filter(word => word.length > 1 && !/^\d+$/.test(word));

function editDistance(a, b) {
  let previous = Array.from({length: b.length + 1}, (_, i) => i);

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= b.length; j += 1) {
      current[j] = Math.min(
          previous[j] + 1,
          current[j - 1] + 1,
          previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }

    previous = current;
  }

  return previous[b.length];
}

/* 0 to 1: how alike the last path segments are, or how many words match. */
function similarity(path, item) {
  const lastSegment = value => value.replace(/\/+$/, '').split('/').pop() || '';
  const asked = lastSegment(path).toLowerCase();
  const candidate = lastSegment(item.path).toLowerCase();

  if (!asked || !candidate) {
    return 0;
  }

  const spelling = 1 -
    editDistance(asked, candidate) / Math.max(asked.length, candidate.length);
  const askedWords = new Set(words(asked));
  const itemWords = new Set([...words(candidate), ...words(item.title || '')]);
  const shared = [...askedWords].filter(word => itemWords.has(word)).length;
  const overlap = askedWords.size ? shared / askedWords.size : 0;

  return Math.max(spelling, overlap);
}

export function suggestPages(path, items) {
  return items
      .map(item => ({item, score: similarity(path, item)}))
      .filter(({item, score}) => score >= MIN_SCORE && item.path !== path)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_SUGGESTIONS)
      .map(({item}) => item);
}

export async function showNotFound(terminal) {
  if (!terminal) {
    return;
  }

  let path = window.location.pathname;

  try {
    path = decodeURI(path);
  } catch {
    // Leave a malformed address as it came.
  }

  terminal.querySelectorAll('[data-path]').forEach((node) => {
    node.textContent = path;
  });

  let items;

  try {
    const response = await fetch('/search-index.json');
    items = await response.json();
  } catch {
    return;
  }

  const suggestions = suggestPages(path, items);

  if (!suggestions.length) {
    return;
  }

  const list = terminal.querySelector('[data-suggestion-list]');

  suggestions.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.path;
    link.textContent = item.path;
    list.append('\n    ', link);
  });

  terminal.querySelector('[data-suggestions]').hidden = false;
  terminal.querySelector('[data-hint]').hidden = true;
}
