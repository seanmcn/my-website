// Define a default UI for filtering
import React from 'react';
import { useAsyncDebounce } from 'react-table';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((v) => {
    setGlobalFilter(v || undefined);
  }, 200);

  return (
    <div className="control has-icons-right">
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`Search ${count} commands...`}
        className="input is-medium"
      />
      <span className="icon is-right">
        <i className="fas fa-search" />
      </span>
    </div>
  );
}

export default GlobalFilter;
