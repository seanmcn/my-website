import React from 'react'

const SearchButtonClose = ({ closeModal }) => (
  <button onClick={closeModal} className="searchCloseButton" type="button">
    <span className="icon" aria-label="Close window icon">
      <i className="fas fa-window-close" />
    </span>
  </button>
)

export default SearchButtonClose
