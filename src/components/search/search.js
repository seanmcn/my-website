import React, { Component } from 'react';
import algoliasearch from 'algoliasearch/lite'
import { Link } from 'gatsby'
import Modal from 'react-modal';
import './search.scss';

import {
  connectSearchBox,
  Configure,
  InstantSearch,
  Highlight,
  InfiniteHits,
} from 'react-instantsearch-dom';


const customStyles = {
  content: {
    top: '10%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%)',
    minWidth: '50%',
  }
};

class SearchBox extends Component {
  timerId = null;

  constructor(props) {
    super(props);
    const { currentRefinement } = this.props;
    this.state = {
      value: currentRefinement
    };
  }

  onChangeDebounced = (event) => {
    const { refine, delay } = this.props;
    const {value} = event.currentTarget;

    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => refine(value), delay);

    this.setState(() => ({
      value
    }));
  };

  render() {
    const { value } = this.state;

    return (
      <input
        type="search"
        value={value}
        onChange={this.onChangeDebounced}
        className="ais-SearchBox-input"
        placeholder="Enter search term here"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        maxLength="512"
      />
    );
  }
}

const DebouncedSearchBox = connectSearchBox(SearchBox);

const SearchResult = ({ hit }) =>   (
  <div key={hit.objectID}>
    <Link to={`/blog/${hit.slug}/`}>
      <h4>
        <Highlight attribute="title" hit={hit} tagName="strong" />
      </h4>
    </Link>
    <div>
      <Highlight attribute="excerpt" hit={hit} tagName="strong" />
    </div>
  </div>
);


export default function Search() {
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  )
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  Modal.setAppElement('#___gatsby')

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal(){
    setModalIsOpen(false);
  }


  return typeof document !== 'undefined' ? (
    <>
      <button
        className="navbar-item searchButton"
        onClick={openModal}
        aria-label="Open search modal"
        type="button"
      >
        <span className="icon searchIcon" aria-label="Magnifying glass icon">
          <i className="fas fa-search" />
        </span>
        Search
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <button onClick={closeModal} className="searchCloseButton" type="button">
          <span className="icon" aria-label="Close window icon">
            <i className="fas fa-window-close" />
          </span>
        </button>
        <InstantSearch
          indexName={process.env.GATSBY_ALGOLIA_INDEX_NAME}
          searchClient={searchClient}
        >
          <Configure
            hitsPerPage={5}
            distinct
          />
          <DebouncedSearchBox delay={500} />
          <InfiniteHits hitComponent={SearchResult} />
        </InstantSearch>
      </Modal>
    </>

  ) : null;
}
