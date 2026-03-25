import React, {Component} from 'react';

class SearchInput extends Component {
  timerId = null;

  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  onChangeDebounce = (event) => {
    const {onSearch, delay} = this.props;
    const {value} = event.currentTarget;

    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => onSearch(value), delay);

    this.setState(() => ({
      value,
    }));
  };

  render() {
    const {value} = this.state;
    return (
      <input
        type="search"
        value={value}
        onChange={this.onChangeDebounce}
        className="searchBox-input"
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

export default SearchInput;
