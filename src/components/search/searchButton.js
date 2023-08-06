import React from 'react';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
const SearchButton = ({openModal}) => (
  <button
    className="navbar-item searchButton"
    onClick={openModal}
    aria-label="Open search modal"
    type="button"
  >
    <span className="icon searchIcon">
      <FontAwesomeIcon icon={icon({name: 'search'})} />
    </span>
    Search
  </button>
);

export default SearchButton;
