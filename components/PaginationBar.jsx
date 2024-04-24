// PaginationBar.js
import React from 'react';

const PaginationBar = ({ totalItems, itemsPerPage, onPageChange, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination flex items-center justify-center mt-20">
      <button onClick={handlePreviousClick} disabled={currentPage === 1} className={`navButton navBarrButton-bgcolor ${currentPage === 1 ? 'disabled' : ''}`}>
        &lt; 
      </button>
      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={`pageButton ${currentPage === page ? 'active' : ''}`}>
          {page}
        </button>
      ))}
      <button onClick={handleNextClick} disabled={currentPage === totalPages} className={`navButton navBarrButton-bgcolor ${currentPage === totalPages ? 'disabled' : ''}`}>
         &gt;
      </button>
    </div>
  );
};

export default PaginationBar;
