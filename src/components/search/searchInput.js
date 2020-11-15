import React, { Component } from 'react';

/* eslint-disable jsx-a11y/no-autofocus */

class SearchInput extends Component {
  timerId = null;

  constructor (props) {
    super(props);
    const { currentRefinement } = this.props;
    this.state = {
      value: currentRefinement
    };
  }

  onChangeDebounce = (event) => {
    const { refine, delay } = this.props;
    const { value } = event.currentTarget;

    window.clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => refine(value), delay);

    this.setState(() => ({
      value
    }));
  };

  render () {
    const { value } = this.state;
    return (
      <input
        type="search"
        value={value}
        onChange={this.onChangeDebounce}
        className="ais-SearchBox-input"
        placeholder="Enter search term here"
        autoComplete="off"
        autoCorrect="off"
        autoFocus
        autoCapitalize="off"
        spellCheck="false"
        maxLength="512"
      />
    );
  }
}

export default SearchInput;