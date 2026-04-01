import React from 'react';
import PropTypes from 'prop-types';

const SearchInput = ({onSearch, delay, query}) => {
  const [value, setValue] = React.useState(query);

  React.useEffect(() => {
    setValue(query);
  }, [query]);

  React.useEffect(() => {
    const timerId = setTimeout(() => onSearch(value), delay);

    return () => clearTimeout(timerId);
  }, [delay, onSearch, value]);

  return (
    <input
      type="search"
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      className="searchBox-input"
      placeholder="Search posts"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      maxLength="512"
      aria-label="Search blog posts"
    />
  );
};

SearchInput.propTypes = {
  delay: PropTypes.number.isRequired,
  onSearch: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default SearchInput;
