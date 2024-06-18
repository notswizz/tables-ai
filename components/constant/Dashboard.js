import React from 'react';

const Dashboard = ({ activeTab }) => {
  const renderButtons = () => {
    switch (activeTab) {
      case 'clients':
        return (
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none">
            Send Invoice
          </button>
        );
      case 'staff':
        return (
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none">
            Send Email
          </button>
        );
      case 'bookings':
        return (
          <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 focus:outline-none">
            Print Master
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <div className="flex space-x-4">
        {renderButtons()}
      </div>
    </div>
  );
};

export default Dashboard;
