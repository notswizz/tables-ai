import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stats = () => {
  const [clients, setClients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchStaff = async () => {
      try {
        const response = await axios.get('/api/staff');
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchClients();
    fetchStaff();
    fetchBookings();
  }, []);

  const totalClients = clients.length;
  const totalStaff = staff.length;
  const totalBookings = bookings.length;

  const totalStaffRequired = bookings.reduce((acc, booking) => acc + booking.totalStaff, 0);

  const averageStaffPerBooking = totalBookings > 0 ? (totalStaffRequired / totalBookings).toFixed(2) : 0;

  const averageDaysPerBooking = totalBookings > 0
    ? (bookings.reduce((acc, booking) => acc + booking.staffNeeded.length, 0) / totalBookings).toFixed(2)
    : 0;

  const bookingsByShow = bookings.reduce((acc, booking) => {
    if (!acc[booking.show]) {
      acc[booking.show] = { totalDays: 0, totalStaff: 0 };
    }
    acc[booking.show].totalDays += booking.staffNeeded.length;
    acc[booking.show].totalStaff += booking.totalStaff;
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Clients & Staff</h2>
          <p className="text-xl text-gray-700">Total Clients: <span className="font-semibold">{totalClients}</span></p>
          <p className="text-xl text-gray-700">Total Staff: <span className="font-semibold">{totalStaff}</span></p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Bookings</h2>
          <p className="text-xl text-gray-700">Total Bookings: <span className="font-semibold">{totalBookings}</span></p>
          <p className="text-xl text-gray-700">Average Staff per Booking: <span className="font-semibold">{averageStaffPerBooking}</span></p>
          <p className="text-xl text-gray-700">Average Days per Booking: <span className="font-semibold">{averageDaysPerBooking}</span></p>
          <p className="text-xl text-gray-700">Total Staff Required: <span className="font-semibold">{totalStaffRequired}</span></p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105">
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Bookings by Show</h2>
          {Object.entries(bookingsByShow).map(([show, stats]) => (
            <div key={show} className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{show}</h3>
              <p className="text-lg text-gray-700">Total Days: <span className="font-semibold">{stats.totalDays}</span></p>
              <p className="text-lg text-gray-700">Total Staff: <span className="font-semibold">{stats.totalStaff}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
