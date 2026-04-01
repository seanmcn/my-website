import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import SearchInput from './searchInput';
import SearchResults from './searchResults';
import SearchButtonClose from './searchButtonClose';

if (typeof document !== 'undefined') {
  Modal.setAppElement('#___gatsby');
}

const SearchModal = ({
  modalIsOpen,
  closeModal,
  onSearch,
  results,
  query,
  loadingIndex,
  browseCategories,
  facetGroups,
  activeFilter,
  onSelectBrowse,
  onSelectFilter,
  clearFilter,
}) => (
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
          Find posts by title, keywords, tags, and post content.
        </p>
      </div>
      <SearchButtonClose closeModal={closeModal} />
    </div>
    <SearchInput onSearch={onSearch} delay={250} query={query} />
    <SearchResults
      results={results}
      query={query}
      loadingIndex={loadingIndex}
      browseCategories={browseCategories}
      facetGroups={facetGroups}
      activeFilter={activeFilter}
      onSelectBrowse={onSelectBrowse}
      onSelectFilter={onSelectFilter}
      clearFilter={clearFilter}
    />
  </Modal>
);

SearchModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  results: PropTypes.array.isRequired,
  query: PropTypes.string.isRequired,
  loadingIndex: PropTypes.bool.isRequired,
  browseCategories: PropTypes.array.isRequired,
  facetGroups: PropTypes.shape({
    categories: PropTypes.array,
    tags: PropTypes.array,
  }).isRequired,
  activeFilter: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.string,
  }),
  onSelectBrowse: PropTypes.func.isRequired,
  onSelectFilter: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
};

export default SearchModal;
