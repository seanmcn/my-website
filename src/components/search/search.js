import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import SearchButton from './searchButton';
import SearchModal from './searchModal';
import './search.scss';

const Search = (props) => {
  const { toggleMenu, activeMenu } = props;
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY,
  );

  const [modalIsOpen, setModalIsOpen] = React.useState(false);

  function openModal() {
    if (activeMenu) {
      toggleMenu();
    }
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return typeof document !== 'undefined' ? (
    <>
      <SearchButton openModal={openModal} />
      <SearchModal
        modalIsOpen={modalIsOpen}
        closeModal={closeModal}
        searchClient={searchClient}
      />
    </>
  ) : null;
};

export default Search;
