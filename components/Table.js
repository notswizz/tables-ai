import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} className="border px-2 py-1 rounded" />;
};

const Table = ({ columns, data, updateData }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
    defaultColumn: { Cell: EditableCell }, // Add default Cell renderer
  });

  return (
    <table {...getTableProps()} className="min-w-full bg-white">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                key={column.id}
                {...column.getHeaderProps()}
                className="py-2 px-4 bg-gray-200 border-b border-gray-200 text-left text-sm leading-4 font-medium text-gray-700 uppercase tracking-wider"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr key={row.id} {...row.getRowProps()} className="border-b border-gray-200">
              {row.cells.map(cell => (
                <td
                  key={cell.column.id}
                  {...cell.getCellProps()}
                  className="py-2 px-4 text-sm leading-5 text-gray-700"
                >
                  {cell.render('Cell', { updateData })}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;