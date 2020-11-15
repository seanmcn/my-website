import React from 'react';
import Modal from 'react-modal';
import {
  Configure, connectSearchBox,
  InstantSearch
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import SearchInput from './searchInput';
import SearchResults from './searchResults';
import SearchButtonClose from './searchButtonClose';

Modal.setAppElement('#___gatsby');

const customStyles = {
  content: {
    top: '10%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%)',
    minWidth: '50%',
    maxWidth: '50%',
    // height: '100%',
    // maxHeight: '34em',
  }
};

const DebouncedSearchBox = connectSearchBox(SearchInput);

const SearchModal = ({ modalIsOpen, closeModal, searchClient }) => (
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    // className="searchModal"
    // overlayClassName="searchModalOverlay"
    style={customStyles}
    contentLabel="Search Modal"
  >
    <SearchButtonClose closeModal={closeModal} />
    <InstantSearch
      indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
    >
      <Configure hitsPerPage={5} distinct />
      <DebouncedSearchBox delay={500} />
      <SearchResults />
    </InstantSearch>
  </Modal>
);

SearchModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  searchClient: PropTypes.shape({ appId: PropTypes.string.isRequired, search: PropTypes.func.isRequired }),
};

export default SearchModal;