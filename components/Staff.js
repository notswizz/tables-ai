import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';
import EditableCell from './EditableCell';
import CustomModal from './Modal';
import Filter from './Filter';

const Staff = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filterText, setFilterText] = useState('');

  const fetchData = () => {
    axios.get('/api/staff')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const fetchBookings = (staffName) => {
    axios.get(`/api/bookings`, { params: { staff: staffName } })
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
    const oldName = data[rowIndex].name;

    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          const updatedRow = {
            ...old[rowIndex],
            [columnId]: value,
          };

          // Update staff data
          axios.put('/api/staff', { _id: updatedRow._id.$oid, ...updatedRow })
            .catch(error => {
              console.error('Error updating staff:', error);
            });

          // Update bookings if the name was changed
          if (columnId === 'name' && oldName !== value) {
            updateBookings(oldName, value);
          }

          return updatedRow;
        }
        return row;
      })
    );
  };

  const updateBookings = async (oldName, newName) => {
    try {
      const { data: bookings } = await axios.get('/api/bookings', { params: { staff: oldName } });

      await Promise.all(
        bookings.map(booking => {
          const updatedStaffNeeded = booking.staffNeeded.map(day => ({
            ...day,
            staffNames: day.staffNames.map(name => name === oldName ? newName : name)
          }));

          return axios.put('/api/bookings', { ...booking, staffNeeded: updatedStaffNeeded });
        })
      );
    } catch (error) {
      console.error('Error updating bookings:', error);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(row => row.name.toLowerCase().includes(filterText.toLowerCase()));
  }, [data, filterText]);

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

  const handleRowClick = (row) => {
    setSelectedEntry(row.original);
    fetchBookings(row.original.name);
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getBookingsForStaff = (staffName) => {
    const result = [];
    const seenBookings = new Set();

    bookings.forEach(booking => {
      let totalDays = 0;
      booking.staffNeeded.forEach(day => {
        if (day.staffNames.includes(staffName)) {
          totalDays++;
        }
      });

      if (totalDays > 0) {
        const key = `${booking.show}-${booking.client}`;
        if (!seenBookings.has(key)) {
          seenBookings.add(key);
          result.push({
            show: booking.show,
            client: booking.client,
            dateRange: `${formatDate(booking.staffNeeded[0].date)} - ${formatDate(booking.staffNeeded[booking.staffNeeded.length - 1].date)}`,
            totalDays: totalDays
          });
        }
      }
    });

    return result;
  };

  return (
    <div>
      <Filter filterText={filterText} setFilterText={setFilterText} />
      <Table columns={columns} data={filteredData} updateData={updateData} onRowClick={handleRowClick} />

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedEntry && (
          <div className="p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto">
            <div className="border p-4 rounded-lg mb-4">
              <div className="flex justify-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="text-lg text-gray-700"></div>
                  <div className="text-lg font-semibold text-gray-900">{selectedEntry.name}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-lg text-gray-700"> <span className="font-semibold text-gray-900">{selectedEntry.location}</span></div>
                <div className="text-lg text-gray-700"> <span className="font-semibold text-gray-900">{selectedEntry.phone}</span></div>
                <div className="text-lg text-gray-700"><span className="font-semibold text-gray-900">{selectedEntry.email}</span></div>
                <div className="text-lg text-gray-700"> <span className="font-semibold text-gray-900">{selectedEntry.instagram}</span></div>
                <div className="text-lg text-gray-700"><strong>Shoe Size:</strong> <span className="font-semibold text-gray-900">{selectedEntry.shoeSize}</span></div>
                <div className="text-lg text-gray-700"><strong>Clothes Size:</strong> <span className="font-semibold text-gray-900">{selectedEntry.clothesSize}</span></div>
                <div className="text-lg text-gray-700"><span className="font-semibold text-gray-900">{selectedEntry.college}</span></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">Bookings</h3>
            {bookings.length > 0 ? (
              <div className="overflow-y-auto max-h-64">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Show</th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Client</th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Date Range</th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-800 uppercase tracking-wider">Total Days</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {getBookingsForStaff(selectedEntry.name).map((booking, index) => (
                      <tr key={index}>
                        <td className="py-2 px-6 text-sm text-gray-700">{booking.show}</td>
                        <td className="py-2 px-6 text-sm text-gray-700">{booking.client}</td>
                        <td className="py-2 px-6 text-sm text-gray-700">{booking.dateRange}</td>
                        <td className="py-2 px-6 text-sm text-gray-700">{booking.totalDays}</td>
                      </tr>
                    ))}
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

export default Staff;
