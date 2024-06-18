import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const StaffForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'ATL',
    instagram: '',
    shoeSize: '',
    clothesSize: '',
    college: '',
    availability: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAvailabilityChange = (date, index, field) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = {
      ...newAvailability[index],
      [field]: field === 'date' ? date : e.target.value
    };
    setFormData({
      ...formData,
      availability: newAvailability
    });
  };

  const addAvailability = () => {
    setFormData({
      ...formData,
      availability: [
        ...formData.availability,
        { date: new Date(), show: '', available: 'yes' }
      ]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/staff', formData);
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: 'ATL',
        instagram: '',
        shoeSize: '',
        clothesSize: '',
        college: '',
        availability: []
      });
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
          Location
        </label>
        <select
          name="location"
          id="location"
          value={formData.location}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="ATL">ATL</option>
          <option value="NYC">NYC</option>
          <option value="LA">LA</option>
          <option value="DAL">DAL</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instagram">
          Instagram @
        </label>
        <input
          type="text"
          name="instagram"
          id="instagram"
          value={formData.instagram}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shoeSize">
          Shoe Size
        </label>
        <input
          type="text"
          name="shoeSize"
          id="shoeSize"
          value={formData.shoeSize}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clothesSize">
          Clothes Size
        </label>
        <input
          type="text"
          name="clothesSize"
          id="clothesSize"
          value={formData.clothesSize}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="college">
          College
        </label>
        <input
          type="text"
          name="college"
          id="college"
          value={formData.college}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      {/* Availability section */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Availability
        </label>
        {formData.availability.map((availability, index) => (
          <div key={index} className="mb-2">
            <DatePicker
              selected={availability.date}
              onChange={(date) => handleAvailabilityChange(date, index, 'date')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <input
              type="text"
              name="show"
              value={availability.show}
              onChange={(e) => handleAvailabilityChange(e, index, 'show')}
              placeholder="Show"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <select
              name="available"
              value={availability.available}
              onChange={(e) => handleAvailabilityChange(e, index, 'available')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={addAvailability}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Add Availability
        </button>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
};

export default StaffForm;