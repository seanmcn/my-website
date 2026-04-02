import React from 'react';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const SearchButtonClose = ({closeModal}) => (
  <button
    onClick={closeModal}
    className="searchCloseButton"
    type="button"
    aria-label="Close search"
  >
    <span className="icon" aria-hidden="true">
      <FontAwesomeIcon icon={icon({name: 'xmark'})} />
    </span>
  </button>
);

export default SearchButtonClose;
