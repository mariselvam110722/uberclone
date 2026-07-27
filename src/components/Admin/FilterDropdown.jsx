import React from 'react'
import './FilterDropdown.css'

/**
 * FilterDropdown Component
 * Reusable select element for categorizing and partitioning table or chart data.
 */
const FilterDropdown = ({ label, options = [], value, onChange }) => {
  return (
    <div className="admin-filter-wrap">
      {label && <span className="filter-lbl">{label}:</span>}
      <select
        className="admin-filter-select"
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      >
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt
          const lbl = typeof opt === 'object' ? opt.label : opt
          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default FilterDropdown
