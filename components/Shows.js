import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import Filter from './Filter';

const Shows = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fetchData = () => {
    axios.get('/api/shows')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const updatedRow = {
            ...old[rowIndex],
            [columnId]: value,
          };
          axios.put('/api/shows', { _id: updatedRow._id.$oid, ...updatedRow })
            .catch(error => {
              console.error('Error updating data:', error);
            });
          return updatedRow;
        }
        return row;
      })
    );
  };

  const filteredData = useMemo(() => {
    return data.filter(row => row.location.toLowerCase().includes(filterText.toLowerCase()));
  }, [data, filterText]);

  const locationOptions = ['ATL', 'NYC', 'LA', 'DAL'];
  const seasonOptions = ['summer', 'winter', 'fall', 'spring'];
  const typeOptions = ['gift', 'apparel', 'bridal', 'other'];

  const LocationCell = ({ value: initialValue, row: { index }, column: { id }, updateData }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
      updateData(index, id, e.target.value);
    };

    return (
      <select value={value} onChange={onChange} className="border border-gray-300 px-2 py-1 rounded">
        {locationOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  const SeasonCell = ({ value: initialValue, row: { index }, column: { id }, updateData }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
      updateData(index, id, e.target.value);
    };

    return (
      <select value={value} onChange={onChange} className="border border-gray-300 px-2 py-1 rounded">
        {seasonOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  const TypeCell = ({ value: initialValue, row: { index }, column: { id }, updateData }) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e) => {
      setValue(e.target.value);
      updateData(index, id, e.target.value);
    };

    return (
      <select value={value} onChange={onChange} className="border border-gray-300 px-2 py-1 rounded">
        {typeOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Location',
        accessor: 'location',
        Cell: LocationCell,
      },
      {
        Header: 'Season',
        accessor: 'season',
        Cell: SeasonCell,
      },
      {
        Header: 'Show Type',
        accessor: 'showType',
        Cell: TypeCell,
      },
      {
        Header: 'Start',
        accessor: 'startDate',
      },
      {
        Header: 'End',
        accessor: 'endDate',
      },
    ],
    []
  );

  return (
    <div>
      <Filter filterText={filterText} setFilterText={setFilterText} />
      <Table columns={columns} data={filteredData} updateData={updateData} />
    </div>
  );
};

export default Shows;
