import React from 'react'
import './SearchBar.css'

/**
 * SearchBar Component
 * Reusable search input with integrated clear toggle for instant data filtering.
 */
const SearchBar = ({ value = '', onChange, placeholder = 'Search by name, email, ID...', onClear }) => {
  return (
    <div className="admin-search-wrap">
      <span className="search-icon-left">🔍</span>
      <input
        type="text"
        className="admin-search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className="btn-clear-search"
          onClick={() => {
            if (onChange) onChange('')
            if (onClear) onClear()
          }}
          title="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar
