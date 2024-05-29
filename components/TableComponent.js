import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import Form from './Form';
import EditableCell from './EditableCell';

const TableComponent = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    axios.get('/api/data')
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

  const handleFormSubmit = () => {
    fetchData();
  };

  const updateData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const updatedRow = {
            ...old[rowIndex],
            [columnId]: value,
          };
          axios.put('/api/data', { _id: updatedRow._id.$oid, ...updatedRow })
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
        Header: 'ID',
        accessor: '_id.$oid', // accessor for nested object
      },
      {
        Header: 'Company',
        accessor: 'company',
        Cell: EditableCell,
      },
      {
        Header: 'Website',
        accessor: 'website',
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
      {
        Header: 'Contact',
        accessor: 'contact',
        Cell: EditableCell,
      },
    ],
    []
  );

  return (
    <div>
      <Form onSubmit={handleFormSubmit} />
      <Table columns={columns} data={data} updateData={updateData} />
    </div>
  );
};

export default TableComponent;
