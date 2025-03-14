import { useState } from 'react';

export default function DateRangeFilter({ onDateChange }) {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const updatedDateRange = { ...dateRange, [name]: value };
    setDateRange(updatedDateRange);
    
    // Only trigger the parent callback if both dates are set
    if (name === 'startDate' && updatedDateRange.endDate) {
      onDateChange(updatedDateRange);
    } else if (name === 'endDate' && updatedDateRange.startDate) {
      onDateChange(updatedDateRange);
    }
  };

  const handleQuickSelect = (days) => {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const updatedDateRange = { startDate, endDate };
    setDateRange(updatedDateRange);
    onDateChange(updatedDateRange);
  };

  return (
    <div className="card mb-6 bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Date Range</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-600 mb-3">Quick Glance:</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleQuickSelect(7)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md text-sm transition-colors duration-200"
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(30)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md text-sm transition-colors duration-200"
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(90)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md text-sm transition-colors duration-200"
          >
            Last 90 Days
          </button>
          <button
            type="button"
            onClick={() => handleQuickSelect(365)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-md text-sm transition-colors duration-200"
          >
            Last Year
          </button>
        </div>
      </div>
    </div>
  );
} 