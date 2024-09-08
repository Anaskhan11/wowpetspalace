import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white h-fit w-3/4 p-4 overflow-auto">
        <div className="flex justify-end">
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
