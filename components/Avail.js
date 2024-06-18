import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Avail = () => {
  const [staffList, setStaffList] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [showsList, setShowsList] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const response = await axios.get('/api/staff');
        setStaffList(response.data);
      } catch (error) {
        console.error('Error fetching staff list:', error);
      }
    };

    const fetchShowsList = async () => {
      try {
        const response = await axios.get('/api/shows');
        setShowsList(response.data);
      } catch (error) {
        console.error('Error fetching shows list:', error);
      }
    };

    fetchStaffList();
    fetchShowsList();
  }, []);

  const handleStaffChange = (e) => {
    const staffId = e.target.value;
    const staff = staffList.find((s) => s._id === staffId);
    setSelectedStaff(staff);
    setAvailability(staff.availability || []);
  };

  const handleShowChange = (e) => {
    const showId = e.target.value;
    const show = showsList.find((s) => s._id === showId);
    setSelectedShow(show);
    setAvailability([]); // Clear availability selections when show is changed
  };

  const handleAvailabilityChange = (date, value) => {
    const showDetails = `${selectedShow.location} - ${selectedShow.season} - ${selectedShow.showType}`;
    const newAvailability = [...availability];
    const index = newAvailability.findIndex((avail) => avail.date === date && avail.show === showDetails);
    if (index > -1) {
      newAvailability[index].available = value;
    } else {
      newAvailability.push({ date, show: showDetails, available: value });
    }
    setAvailability(newAvailability);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;

    try {
      await axios.put('/api/staff', {
        _id: selectedStaff._id,
        availability: availability
      });
      alert('Availability updated successfully');
    } catch (error) {
      console.error('Error updating availability:', error);
      alert('Error updating availability');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Update Availability</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="staff">
            Select Staff
          </label>
          <select
            id="staff"
            onChange={handleStaffChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a staff member</option>
            {staffList.map((staff) => (
              <option key={staff._id} value={staff._id}>
                {staff.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="show">
            Select Show
          </label>
          <select
            id="show"
            onChange={handleShowChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a show</option>
            {showsList.map((show) => (
              <option key={show._id} value={show._id}>
                {show.location} - {show.season} - {show.showType}
              </option>
            ))}
          </select>
        </div>
        {selectedShow && selectedShow.dates.map((dateObj, index) => (
          <div key={index} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              {dateObj.date} ({dateObj.type})
            </label>
            <select
              onChange={(e) => handleAvailabilityChange(dateObj.date, e.target.value)}
              value={availability.find((avail) => avail.date === dateObj.date && avail.show === `${selectedShow.location} - ${selectedShow.season} - ${selectedShow.showType}`)?.available || 'select'}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="select">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Avail;
