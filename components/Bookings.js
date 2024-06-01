import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import EditableCell from './EditableCell';

const Bookings = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    axios.get('/api/bookings')
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
          axios.put('/api/bookings', { _id: updatedRow._id.$oid, ...updatedRow })
            .catch(error => {
              console.error('Error updating data:', error);
            });
          return updatedRow;
        }
        return row;
      })
    );
  };

  const columns = useMemo(
    () => [
     
      {
        Header: 'Client',
        accessor: 'client',
        Cell: EditableCell,
      },
      {
        Header: 'Show',
        accessor: 'show',
        Cell: EditableCell,
      },
      {
        Header: 'Days',
        accessor: 'totalStaff',
        Cell: EditableCell,
      },
    
    ],
    []
  );

  return (
    <div>
     
      <Table columns={columns} data={data} updateData={updateData} />

    </div>
  );
};

export default Bookings;
