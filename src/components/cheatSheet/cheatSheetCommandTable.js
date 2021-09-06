/* eslint-disable react/jsx-props-no-spreading */
// Our table component
import React from 'react';
import { useGlobalFilter, useTable } from 'react-table';
import matchSorter from 'match-sorter';
import GlobalFilter from './globalFilter';

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val;

function CheatSheetCommandTable({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => rows.filter((row) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue).toLowerCase().startsWith(
            String(filterValue).toLowerCase(),
          )
          : true;
      }),
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      filterTypes,
    },
    useGlobalFilter, // useGlobalFilter!
  );

  return (
    <>
      <table
        {...getTableProps()}
        className="table is-striped is-fullwidth is-hoverable is-bordered"
      >
        <thead>
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                (index === 0) ? (
                  <th {...column.getHeaderProps()} width="35%">
                    {column.render('Header')}
                  </th>
                ) : (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                )
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, index) => (
                  <td {...cell.getCellProps()}>
                    {index === 0
                      ? (<code>{cell.render('Cell')}</code>)
                      : cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0
      && (
        <div>
          No results found!
        </div>
      )}
    </>
  );
}

export default CheatSheetCommandTable;
