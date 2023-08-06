import React from 'react';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const SearchButtonClose = ({closeModal}) => (
  <button onClick={closeModal} className="searchCloseButton" type="button">
    <span className="icon" aria-label="Close window icon">
      <FontAwesomeIcon icon={icon({name: 'window-close'})} />
    </span>
  </button>
);

export default SearchButtonClose;
