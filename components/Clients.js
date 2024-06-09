import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import EditableCell from './EditableCell';
import CustomModal from './Modal';
import Filter from './Filter';

const Clients = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fetchData = () => {
    axios.get('/api/clients')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchBookings = (clientName) => {
    axios.get(`/api/bookings`, { params: { client: clientName } })
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
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
          axios.put('/api/clients', { _id: updatedRow._id.$oid, ...updatedRow })
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
    return data.filter(row => row.company.toLowerCase().includes(filterText.toLowerCase()));
  }, [data, filterText]);

  const columns = useMemo(
    () => [
      {
        Header: 'Company',
        accessor: 'company',
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

  const handleRowClick = (row) => {
    setSelectedEntry(row.original);
    fetchBookings(row.original.company);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <Filter filterText={filterText} setFilterText={setFilterText} />
      <Table columns={columns} data={filteredData} updateData={updateData} onRowClick={handleRowClick} />

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedEntry && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center border-b pb-4">Client Details</h2>
            <div className="space-y-2 mb-6">
              <p className="text-lg"><strong>Company:</strong> {selectedEntry.company}</p>
              <p className="text-lg"><strong>Website:</strong> {selectedEntry.website}</p>
              <p className="text-lg"><strong>Phone:</strong> {selectedEntry.phone}</p>
              <p className="text-lg"><strong>Email:</strong> {selectedEntry.email}</p>
              <p className="text-lg"><strong>Contact:</strong> {selectedEntry.contact}</p>
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-4 border-b pb-2">Bookings</h3>
            {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Show</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date Range</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Total Days</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Total Staff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map(booking => {
                      const startDate = formatDate(booking.staffNeeded[0].date);
                      const endDate = formatDate(booking.staffNeeded[booking.staffNeeded.length - 1].date);
                      const totalDays = booking.staffNeeded.length;
                      return (
                        <tr key={booking._id.$oid} className="bg-gray-50">
                          <td className="py-2 px-4 text-sm text-gray-700">{booking.show}</td>
                          <td className="py-2 px-4 text-sm text-gray-700">{startDate} - {endDate}</td>
                          <td className="py-2 px-4 text-sm text-gray-700">{totalDays}</td>
                          <td className="py-2 px-4 text-sm text-gray-700">{booking.totalStaff}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No bookings available.</p>
            )}
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default Clients;
