import React, { useState } from 'react';
import Clients from '../components/Clients';
import Staff from '../components/Staff';
import Shows from '../components/Shows';
import Bookings from '../components/Bookings';


const playGearSound = () => {
  const audio = new Audio('/click.wav'); // Use the root-relative path
  audio.play();
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('clients');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    playGearSound();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => handleTabClick('clients')}
          className={`px-6 py-3 rounded-tl-lg rounded-bl-lg focus:outline-none transition duration-300 ${
            activeTab === 'clients' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Clients
        </button>
        <button
          onClick={() => handleTabClick('staff')}
          className={`px-6 py-3 focus:outline-none transition duration-300 ${
            activeTab === 'staff' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Staff
        </button>
        <button
          onClick={() => handleTabClick('shows')}
          className={`px-6 py-3 focus:outline-none transition duration-300 ${
            activeTab === 'shows' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Shows
        </button>
        <button
          onClick={() => handleTabClick('bookings')}
          className={`px-6 py-3 rounded-tr-lg rounded-br-lg focus:outline-none transition duration-300 ${
            activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
          }`}
        >
          Bookings
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        {activeTab === 'clients' && <Clients />}
        {activeTab === 'staff' && <Staff />}
        {activeTab === 'shows' && <Shows />}
        {activeTab === 'bookings' && <Bookings />}
      </div>

   
    </div>
  );
};

export default HomePage;
