import React from 'react';
import {icon} from '@fortawesome/fontawesome-svg-core/import.macro';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

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
        <FontAwesomeIcon icon={icon({name: 'search'})} />
      </span>
    </div>
  );
}

export default GlobalFilter;
