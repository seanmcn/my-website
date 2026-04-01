import React from 'react';
import Fuse from 'fuse.js';
import {Helmet} from 'react-helmet';
import SearchButton from './searchButton';
import SearchModal from './searchModal';
import './search.scss';

const fuseOptions = {
  keys: [
    {name: 'title', weight: 5},
    {name: 'keywords', weight: 4},
    {name: 'tags', weight: 3.5},
    {name: 'category', weight: 2.5},
    {name: 'headings', weight: 2},
    {name: 'bodyPlainText', weight: 1.5},
    {name: 'excerpt', weight: 1},
  ],
  threshold: 0.26,
  ignoreLocation: true,
  includeMatches: true,
  includeScore: true,
  minMatchCharLength: 2,
};

function getTopCategories(searchIndex) {
  if (!Array.isArray(searchIndex)) {
    return [];
  }

  const categoryMap = new Map();

  searchIndex.forEach(post => {
    const categoryKey = post.normalizedCategory || post.category;
    if (!categoryKey) {
      return;
    }

    const existingCategory = categoryMap.get(categoryKey) || {
      count: 0,
      label: post.category,
      value: categoryKey,
    };

    existingCategory.count += 1;
    categoryMap.set(categoryKey, existingCategory);
  });

  return Array.from(categoryMap.values())
      .sort((left, right) => right.count - left.count)
      .slice(0, 6);
}

function normalizeSearchIndex(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.nodes)) {
    return data.nodes;
  }

  return [];
}

function getRecencyBoost(date) {
  const publishedDate = Date.parse(date);
  if (Number.isNaN(publishedDate)) {
    return 0;
  }

  const ageInDays = Math.max(
      0,
      (Date.now() - publishedDate) / (1000 * 60 * 60 * 24),
  );

  return Math.max(0, 16 - Math.floor(ageInDays / 365));
}

function getSearchRank(result, query) {
  const queryTerm = query.trim().toLowerCase();
  const {item} = result;
  let boost = 0;

  if (item.normalizedTitle === queryTerm) {
    boost += 160;
  } else if (item.normalizedTitle.startsWith(queryTerm)) {
    boost += 70;
  }

  if ((item.normalizedKeywords || []).includes(queryTerm)) {
    boost += 50;
  }

  if ((item.normalizedTags || []).includes(queryTerm)) {
    boost += 40;
  }

  if (item.normalizedCategory === queryTerm) {
    boost += 35;
  }

  return boost + ((1 - (result.score || 0)) * 100) + getRecencyBoost(item.date);
}

function matchesActiveFilter(resultItem, activeFilter) {
  if (!activeFilter) {
    return true;
  }

  if (activeFilter.type === 'category') {
    return resultItem.normalizedCategory === activeFilter.value;
  }

  if (activeFilter.type === 'tag') {
    return (resultItem.normalizedTags || []).includes(activeFilter.value);
  }

  return true;
}

function buildFacetGroups(results) {
  const categoryMap = new Map();
  const tagMap = new Map();

  results.forEach(({item}) => {
    if (item.normalizedCategory) {
      const category = categoryMap.get(item.normalizedCategory) || {
        count: 0,
        label: item.category,
        type: 'category',
        value: item.normalizedCategory,
      };

      category.count += 1;
      categoryMap.set(item.normalizedCategory, category);
    }

    (item.tags || []).forEach(tag => {
      const normalizedTag = tag.toLowerCase();
      const existingTag = tagMap.get(normalizedTag) || {
        count: 0,
        label: tag,
        type: 'tag',
        value: normalizedTag,
      };

      existingTag.count += 1;
      tagMap.set(normalizedTag, existingTag);
    });
  });

  return {
    categories: Array.from(categoryMap.values()).sort((left, right) =>
      right.count - left.count,
    ),
    tags: Array.from(tagMap.values()).sort((left, right) =>
      right.count - left.count,
    ).slice(0, 8),
  };
}

const Search = (props) => {
  const {toggleMenu, activeMenu} = props;
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [fuse, setFuse] = React.useState(null);
  const [searchIndex, setSearchIndex] = React.useState([]);
  const [results, setResults] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState(null);
  const [loadingIndex, setLoadingIndex] = React.useState(true);

  React.useEffect(() => {
    setIsClient(true);
    setLoadingIndex(true);
    fetch('/search-index.json')
        .then(res => res.json())
        .then(data => {
          const normalizedIndex = normalizeSearchIndex(data);

          setSearchIndex(normalizedIndex);
          setFuse(new Fuse(normalizedIndex, fuseOptions));
          setLoadingIndex(false);
        })
        .catch(() => {
          setSearchIndex([]);
          setFuse(new Fuse([], fuseOptions));
          setLoadingIndex(false);
        });
  }, []);

  React.useEffect(() => {
    if (!fuse || !query.trim()) {
      setResults([]);
      return;
    }

    const rankedResults = fuse.search(query)
        .map(result => ({
          ...result,
          rank: getSearchRank(result, query),
        }))
        .sort((left, right) => right.rank - left.rank);

    setResults(rankedResults);
  }, [fuse, query]);

  function openModal() {
    if (activeMenu) {
      toggleMenu();
    }
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
    setQuery('');
    setResults([]);
    setActiveFilter(null);
  }

  function onSearch(value) {
    setQuery(value);
    setActiveFilter(null);
  }

  const facetGroups = React.useMemo(() => buildFacetGroups(results), [results]);
  const browseCategories = React.useMemo(() => getTopCategories(searchIndex), [searchIndex]);
  const filteredResults = React.useMemo(
      () => results
          .filter(result => matchesActiveFilter(result.item, activeFilter))
          .slice(0, 8),
      [activeFilter, results],
  );

  return (
    <>
      <SearchButton openModal={openModal}/>
      {isClient && (
        <SearchModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          onSearch={onSearch}
          results={filteredResults}
          query={query}
          loadingIndex={loadingIndex}
          browseCategories={browseCategories}
          facetGroups={facetGroups}
          activeFilter={activeFilter}
          onSelectBrowse={value => onSearch(value)}
          onSelectFilter={setActiveFilter}
          clearFilter={() => setActiveFilter(null)}
        />
      )}
      {modalIsOpen && isClient && (
        <Helmet htmlAttributes={{class: 'no-html-scroll'}}/>
      )}
    </>
  );
};

export default Search;
