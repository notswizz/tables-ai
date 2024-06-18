import React, { useState, useEffect } from 'react';

const playClickSound = () => {
  const audio = new Audio('/gear.wav'); // Use the root-relative path
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
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={playClickSound} // Play sound on focus
      className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-700"
    />
  );
};

export default EditableCell;
