import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomModal from '../constant/Modal';
import StaffDropdown from '../constant/StaffDropdown';

const BookingModal = ({ isOpen, onClose, booking }) => {
  const [localBooking, setLocalBooking] = useState(booking);
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    setLocalBooking(booking);
  }, [booking]);

  useEffect(() => {
    if (isOpen) {
      axios.get('/api/staff')
        .then(response => setStaffList(response.data))
        .catch(error => console.error('Error fetching staff:', error));
    }
  }, [isOpen]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const updateStaffName = async (dayIndex, staffIndex, value) => {
    const updatedBooking = { ...localBooking };
    if (!updatedBooking.staffNeeded[dayIndex].staffNames) {
      updatedBooking.staffNeeded[dayIndex].staffNames = [];
    }
    updatedBooking.staffNeeded[dayIndex].staffNames[staffIndex] = value;
    setLocalBooking(updatedBooking);

    try {
      await axios.put('/api/bookings', updatedBooking);
      console.log('Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose}>
      {localBooking && (
        <div>
          <div className="flex space-x-4 mb-6">
            <p className="text-lg"><strong>Client:</strong> {localBooking.client}</p>
            <p className="text-lg"><strong>Show:</strong> {localBooking.show}</p>
            <p className="text-lg"><strong>Total Days:</strong> {localBooking.totalStaff}</p>
          </div>
          {localBooking.staffNeeded.length > 0 ? (
            <div className="overflow-y-auto max-h-96">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Staff Working</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {localBooking.staffNeeded.map((day, dayIndex) => {
                    const staffNeededCount = day.staff;
                    const staffNames = day.staffNames || [];
                    const staffFields = Array.from({ length: staffNeededCount }, (_, i) => staffNames[i] || '');

                    return (
                      <tr key={dayIndex} className="bg-gray-50">
                        <td className="py-2 px-4 text-sm text-gray-700">{formatDate(day.date)}</td>
                        <td className="py-2 px-4 text-sm text-gray-700">
                          {staffFields.map((staffName, staffIndex) => (
                            <StaffDropdown
                              key={staffIndex}
                              value={staffName}
                              row={{ index: dayIndex }}
                              column={{ id: `staffNames[${staffIndex}]` }}
                              updateData={(index, id, value) => updateStaffName(dayIndex, staffIndex, value)}
                              staffList={staffList}
                              date={day.date}
                            />
                          ))}
                        </td>
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
  );
};

export default BookingModal;
