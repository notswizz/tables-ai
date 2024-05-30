import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BookingForm = ({ onSubmit }) => {
  const [clients, setClients] = useState([]);
  const [shows, setShows] = useState([]);
  const [formData, setFormData] = useState({
    client: '',
    show: '',
    staffNeeded: []
  });

  useEffect(() => {
    const fetchClients = async () => {
      const response = await axios.get('/api/clients');
      setClients(response.data);
    };

    const fetchShows = async () => {
      const response = await axios.get('/api/shows');
      setShows(response.data);
    };

    fetchClients();
    fetchShows();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleShowChange = (e) => {
    const { value } = e.target;
    const selectedShow = shows.find(show => show._id === value);
    if (selectedShow) {
      const startDate = new Date(selectedShow.startDate);
      const endDate = new Date(selectedShow.endDate);
      const dates = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push({ date: new Date(d), staff: 0 });
      }
      setFormData({
        ...formData,
        show: value,
        staffNeeded: dates
      });
    }
  };

  const handleStaffChange = (index, value) => {
    const updatedStaffNeeded = [...formData.staffNeeded];
    updatedStaffNeeded[index].staff = parseInt(value, 10);
    setFormData({
      ...formData,
      staffNeeded: updatedStaffNeeded
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const totalStaff = formData.staffNeeded.reduce((sum, day) => sum + day.staff, 0);
    const bookingData = {
      ...formData,
      client: clients.find(client => client._id === formData.client).company,
      show: `${shows.find(show => show._id === formData.show).location} - ${shows.find(show => show._id === formData.show).season}`,
      totalStaff
    };
    try {
      await axios.post('/api/bookings', bookingData);
      setFormData({
        client: '',
        show: '',
        staffNeeded: []
      });
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="client">
          Client
        </label>
        <select
          name="client"
          id="client"
          value={formData.client}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select Client</option>
          {clients.map(client => (
            <option key={client._id} value={client._id}>{client.company}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="show">
          Show
        </label>
        <select
          name="show"
          id="show"
          value={formData.show}
          onChange={handleShowChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select Show</option>
          {shows.map(show => (
            <option key={show._id} value={show._id}>{show.location} - {show.season}</option>
          ))}
        </select>
      </div>
      {formData.staffNeeded.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Staff Needed Per Day
          </label>
          {formData.staffNeeded.map((day, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="mr-2">{day.date.toDateString()}</span>
              <input
                type="number"
                value={day.staff}
                onChange={(e) => handleStaffChange(index, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default BookingForm;