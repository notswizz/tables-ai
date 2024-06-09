import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import EditableCell from './EditableCell';
import Filter from './Filter';
import CustomModal from './Modal';

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

  const filteredData = useMemo(() => {
    return data.filter(row => row.client.toLowerCase().includes(filterText.toLowerCase()));
  }, [data, filterText]);

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

  const handleRowClick = (row) => {
    setSelectedBooking(row.original);
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
        {selectedBooking && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center border-b pb-4">Booking Details</h2>
            <div className="flex space-x-4 mb-6">
              <p className="text-lg"><strong>Client:</strong> {selectedBooking.client}</p>
              <p className="text-lg"><strong>Show:</strong> {selectedBooking.show}</p>
              <p className="text-lg"><strong>Total Staff:</strong> {selectedBooking.totalStaff}</p>
            </div>
            <h3 className="text-xl font-semibold mt-4 mb-4 border-b pb-2">Dates and Staff</h3>
            {selectedBooking.staffNeeded.length > 0 ? (
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Staff Working</th>
                      <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Staff Needed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedBooking.staffNeeded.map((day, index) => {
                      const staffNeeded = day.staff - day.staffNames.length;
                      return (
                        <tr key={index} className="bg-gray-50">
                          <td className="py-2 px-4 text-sm text-gray-700">{formatDate(day.date)}</td>
                          <td className="py-2 px-4 text-sm text-gray-700">{day.staffNames.join(', ') || 'No staff working'}</td>
                          <td className="py-2 px-4 text-sm text-gray-700">{staffNeeded > 0 ? `${staffNeeded} more needed` : 'Fully staffed'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No dates available.</p>
            )}
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default Bookings;
