import React from 'react';
import Fuse from 'fuse.js';
import {Helmet} from 'react-helmet';
import SearchButton from './searchButton';
import SearchModal from './searchModal';
import './search.scss';

const fuseOptions = {
  keys: ['title', 'tags', 'excerpt'],
  threshold: 0.3,
  includeMatches: true,
};

const Search = (props) => {
  const {toggleMenu, activeMenu} = props;
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [fuse, setFuse] = React.useState(null);
  const [results, setResults] = React.useState([]);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    setIsClient(true);
    fetch('/search-index.json')
        .then((res) => res.json())
        .then((data) => setFuse(new Fuse(data, fuseOptions)))
        .catch(() => {});
  }, []);

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
  }

  function onSearch(value) {
    setQuery(value);
    if (fuse && value) {
      setResults(fuse.search(value).slice(0, 5));
    } else {
      setResults([]);
    }
  }

  return (
    <>
      <SearchButton openModal={openModal}/>
      {isClient && (
        <SearchModal
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          onSearch={onSearch}
          results={results}
          query={query}
        />
      )}
      {modalIsOpen && isClient && (
        <Helmet htmlAttributes={{class: 'no-html-scroll'}}/>
      )}
    </>
  );
};

export default Search;
