import { useState } from 'react';

export default function FilterPanel({ onFilterChange }) {
  const [filters, setFilters] = useState({
    scoreRange: '',
    communicationMethod: '',
    searchTerm: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSearchChange = (e) => {
    const { value } = e.target;
    const updatedFilters = { ...filters, searchTerm: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      scoreRange: '',
      communicationMethod: '',
      searchTerm: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="card mb-6">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Filter Patients</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label htmlFor="scoreRange" className="block text-sm font-medium text-gray-700 mb-1">
            Engagement Score Range
          </label>
          <select
            id="scoreRange"
            name="scoreRange"
            value={filters.scoreRange}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Scores</option>
            <option value="0-10">0-10 (Very Low)</option>
            <option value="11-20">11-20 (Low)</option>
            <option value="21-30">21-30 (Medium)</option>
            <option value="31-40">31-40 (High)</option>
            <option value="41-50">41-50 (Very High)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="communicationMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Communication
          </label>
          <select
            id="communicationMethod"
            name="communicationMethod"
            value={filters.communicationMethod}
            onChange={handleFilterChange}
            className="select"
          >
            <option value="">All Methods</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="text">Text</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Name, Email or Phone
          </label>
          <input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            placeholder="Search patients..."
            className="input"
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-secondary"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
} 