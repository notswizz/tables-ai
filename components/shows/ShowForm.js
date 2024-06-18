import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ShowForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    location: '',
    season: '',
    startDate: new Date(),
    endDate: new Date(),
    showType: '',
    dates: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleDateArrayChange = (index, value) => {
    const updatedDates = [...formData.dates];
    updatedDates[index].type = value;
    setFormData({
      ...formData,
      dates: updatedDates
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/shows', formData);
      setFormData({
        location: '',
        season: '',
        startDate: new Date(),
        endDate: new Date(),
        showType: '',
        dates: []
      });
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const generateDateArray = () => {
    const { startDate, endDate } = formData;
    const dates = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push({ date: d.toISOString().split('T')[0], type: 'regular' });
    }
    setFormData({
      ...formData,
      dates
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
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
          <option value="">Select Location</option>
          <option value="ATL">Atlanta</option>
          <option value="NYC">New York City</option>
          <option value="LA">Los Angeles</option>
          <option value="DAL">Dallas</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="season">
          Season
        </label>
        <select
          name="season"
          id="season"
          value={formData.season}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select Season</option>
          <option value="fall">Fall</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="showType">
          Show Type
        </label>
        <select
          name="showType"
          id="showType"
          value={formData.showType}
          onChange={handleChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="">Select Show Type</option>
          <option value="gift">Gift</option>
          <option value="apparel">Apparel</option>
          <option value="bridal">Bridal</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
          Start Date
        </label>
        <DatePicker
          selected={formData.startDate}
          onChange={(date) => handleDateChange('startDate', date)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
          End Date
        </label>
        <DatePicker
          selected={formData.endDate}
          onChange={(date) => handleDateChange('endDate', date)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <button
        type="button"
        onClick={generateDateArray}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
      >
        Generate Dates
      </button>
      {formData.dates.length > 0 && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Dates
          </label>
          {formData.dates.map((day, index) => (
            <div key={index} className="flex items-center mb-2">
              <span className="mr-2">{day.date}</span>
              <select
                value={day.type}
                onChange={(e) => handleDateArrayChange(index, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="regular">Regular</option>
                <option value="set up">Set Up</option>
              </select>
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
          
          export default ShowForm;