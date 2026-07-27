import React from 'react'
import './Pagination.css'

/**
 * Pagination Component
 * Reusable table footer component allowing multi-page record navigation and total count display.
 */
const Pagination = ({ currentPage = 1, totalPages = 1, totalItems = 0, onPageChange }) => {
  return (
    <div className="admin-pagination-bar">
      <div className="pagination-summary">
        Showing Page {currentPage} of {Math.max(1, totalPages)} ({totalItems} Total Records)
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="btn-page-nav"
          disabled={currentPage <= 1}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
        >
          ← Previous
        </button>
        <span className="page-indicator-badge">{currentPage} / {Math.max(1, totalPages)}</span>
        <button
          type="button"
          className="btn-page-nav"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default Pagination
