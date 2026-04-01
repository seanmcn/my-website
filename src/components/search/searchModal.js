import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import SearchInput from './searchInput';
import SearchResults from './searchResults';
import SearchButtonClose from './searchButtonClose';

if (typeof document !== 'undefined') {
  Modal.setAppElement('#___gatsby');
}

const SearchModal = ({modalIsOpen, closeModal, onSearch, results, query}) => (
  <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    className="searchModal"
    overlayClassName="searchModalOverlay"
    contentLabel="Search Modal"
  >
    <div className="searchModalHeader">
      <div>
        <h2 className="searchModalTitle">Search the blog</h2>
        <p className="searchModalSubtitle">
          Find posts by title, tags, or excerpt.
        </p>
      </div>
      <SearchButtonClose closeModal={closeModal} />
    </div>
    <SearchInput onSearch={onSearch} delay={500} />
    <SearchResults results={results} query={query} />
  </Modal>
);

SearchModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
};

export default SearchModal;
