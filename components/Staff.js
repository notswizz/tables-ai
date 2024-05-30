import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import EditableCell from './EditableCell';

const Clients = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    axios.get('/api/staff')
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
          axios.put('/api/staff', { _id: updatedRow._id.$oid, ...updatedRow })
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
        Header: 'Name',
        accessor: 'name',
        Cell: EditableCell,
      },
      {
        Header: 'Location',
        accessor: 'location',
        Cell: EditableCell,
      },
      {
        Header: 'Phone',
        accessor: 'phone',
        Cell: EditableCell,
      },
      {
        Header: 'Email',
        accessor: 'email',
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

export default Clients;
