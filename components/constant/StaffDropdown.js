import React, { useState, useEffect } from 'react';

const playClickSound = () => {
  const audio = new Audio('/gear.wav');
  audio.play();
};

const StaffDropdown = ({ value: initialValue, row, column, updateData, staffList, date }) => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
    updateData(row.index, column.id, e.target.value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const availableStaffList = staffList.filter(staff => 
    staff.availability && staff.availability.some(avail => avail.date === date && avail.available === 'yes')
  );

  if (!availableStaffList) {
    return null; // Handle the case where staffList is undefined
  }

  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={playClickSound}
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
    >
      <option value="">Select staff</option>
      {availableStaffList.map((staff, index) => (
        <option key={index} value={staff.name}>{staff.name}</option>
      ))}
    </select>
  );
};

export default StaffDropdown;
