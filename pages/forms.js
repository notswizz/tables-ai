import React, { useState } from 'react';
import ClientForm from '../components/clients/ClientForm';
import StaffForm from '../components/staff/StaffForm';
import ShowForm from '../components/shows/ShowForm';
import BookingForm from '../components/bookings/BookingForm';
import Avail from '../components/staff/Avail';

const FormPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [clientForm, setClientForm] = useState(false);
  const [staffForm, setStaffForm] = useState(false);
  const [bookingForm, setBookingForm] = useState(false);
  const [availForm, setAvailForm] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forms</h1>
      
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Toggle Show Form
      </button>
      {showForm && <ShowForm onSubmit={() => setShowForm(false)} />}

      <button
        onClick={() => setClientForm(!clientForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Toggle Client Form
      </button>
      {clientForm && <ClientForm onSubmit={() => setClientForm(false)} />}

      <button
        onClick={() => setStaffForm(!staffForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Toggle Staff Form
      </button>
      {staffForm && <StaffForm onSubmit={() => setStaffForm(false)} />}

      <button
        onClick={() => setBookingForm(!bookingForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Toggle Booking Form
      </button>
      {bookingForm && <BookingForm onSubmit={() => setBookingForm(false)} />}

      <button
        onClick={() => setAvailForm(!availForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Toggle Availability Form
      </button>
      {availForm && <Avail onSubmit={() => setAvailForm(false)} />}
    </div>
  );
};

export default FormPage;
