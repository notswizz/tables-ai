// Filter.js
import React from 'react';

const Filter = ({ filterText, setFilterText }) => {
  const handleChange = (e) => {
    setFilterText(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={filterText}
        onChange={handleChange}
        placeholder="Search..."
        className="border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Filter;
