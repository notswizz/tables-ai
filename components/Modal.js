import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next'); // Set the app element for accessibility

const CustomModal = ({ isOpen, onClose, children }) => {
  const customStyles = {
    content: {
      padding: 0,
      border: 'none',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90%',
      width: '600px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      zIndex: 50,
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-pink-500">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
     
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            &times;
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
