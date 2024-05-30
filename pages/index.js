import React, { useState } from 'react';
import Clients from '../components/Clients';
import Staff from '../components/Staff';
import Shows from '../components/Shows';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('clients');

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 rounded-l ${activeTab === 'clients' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Clients
        </button>
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 ${activeTab === 'staff' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Staff
        </button>
        <button
          onClick={() => setActiveTab('shows')}
          className={`px-4 py-2 rounded-r ${activeTab === 'shows' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Shows
        </button>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'clients' && <Clients />}
        {activeTab === 'staff' && <Staff />}
        {activeTab === 'shows' && <Shows />}
      </div>
    </div>
  );
};

export default HomePage;