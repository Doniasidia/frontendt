//PaginationBar
import React from 'react';

const PaginationBar = ({ totalItems, itemsPerPage, onPageChange, currentPage }) => {
  // Calculate the total pages, ensuring it's at least 1
  const totalPages = Math.max(Math.ceil(totalItems / itemsPerPage), 1);

  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center mt-4">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`mx-1 px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
}

export default PaginationBar;
