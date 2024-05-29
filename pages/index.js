import React from 'react';
import TableComponent from '../components/TableComponent';
import ChatBot from '../components/ChatBot';

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Data Table</h1>
      <TableComponent />
      <h1 className="text-2xl font-bold my-4">ChatBot</h1>
      <ChatBot />
    </div>
  );
};

export default HomePage;
