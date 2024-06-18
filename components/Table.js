import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import toast, { Toaster } from 'react-hot-toast';

const playBookSound = () => {
  const audio = new Audio('/book.mp3');
  audio.play();
};

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
    toast.success('Cell updated successfully');
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-gray-700"
    />
  );
};

const Table = ({ columns, data, updateData, onRowClick = () => {} }) => {
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

  const handleDetailsClick = (row) => {
    playBookSound();
    onRowClick(row);
  };

  return (
    <div className="overflow-x-auto max-h-128">
      <Toaster />
      <table {...getTableProps()} className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
          {headerGroups.map(headerGroup => (
            <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  key={column.id}
                  {...column.getHeaderProps()}
                  className="py-3 px-6 text-left text-xs font-semibold uppercase tracking-wider border-b border-pink-700"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white">
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr
                key={row.id}
                {...row.getRowProps()}
                className="hover:bg-gray-100 transition-colors duration-200"
              >
                {row.cells.map(cell => (
                  <td
                    key={cell.column.id}
                    {...cell.getCellProps()}
                    className="py-3 px-6 text-sm text-gray-700 border-b border-gray-200"
                  >
                    {cell.render('Cell', { updateData })}
                  </td>
                ))}
                <td className="py-3 px-6 text-sm text-gray-700 border-b border-gray-200">
                  <button
                    onClick={() => handleDetailsClick(row)}
                    className="bg-pink-100 text-pink-600 px-4 py-2 rounded-md border border-pink-500 hover:bg-pink-200 transition-colors duration-200"
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
