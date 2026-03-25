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
    contentLabel="Search Modal"
  >
    <SearchButtonClose closeModal={closeModal} />
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
