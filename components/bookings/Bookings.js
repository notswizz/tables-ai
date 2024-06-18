import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../constant/Table';
import Filter from '../constant/Filter';
import BookingModal from './BookingModal';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster

const Bookings = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchData = () => {
    axios.get('/api/bookings')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        toast.error('Error fetching data');
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(row => row.client.toLowerCase().includes(filterText.toLowerCase()));
  }, [data, filterText]);

  const columns = useMemo(
    () => [
      {
        Header: 'Client',
        accessor: 'client',
        Cell: ({ value }) => <div>{value}</div>, // Uneditable cell
      },
      {
        Header: 'Show',
        accessor: 'show',
        Cell: ({ value }) => <div>{value}</div>, // Uneditable cell
      },
      {
        Header: 'Days',
        accessor: 'totalStaff',
        Cell: ({ value }) => <div>{value}</div>, // Uneditable cell
      },
    ],
    []
  );

  const handleRowClick = (row) => {
    setSelectedBooking(row.original);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Toaster /> {/* Add Toaster component to render toasts */}
      <Filter filterText={filterText} setFilterText={setFilterText} />
      <Table columns={columns} data={filteredData} onRowClick={handleRowClick} />
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
      />
    </div>
  );
};

export default Bookings;
