import React from 'react';
import {SearchIcon} from '../icons/icons.jsx';

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;

  return (
    <div className="control has-icons-right">
      <input
        value={globalFilter || ''}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} commands...`}
        className="input is-medium"
      />
      <span className="icon is-right">
        <SearchIcon size={14} />
      </span>
    </div>
  );
}

export default GlobalFilter;
