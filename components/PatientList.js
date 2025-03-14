import { useState } from 'react';
import { ArrowDownTrayIcon, CheckIcon } from '@heroicons/react/24/solid';
import * as XLSX from 'xlsx';

export default function PatientList({ patients, selectedPatients = [], setSelectedPatients = null }) {
  const [sortConfig, setSortConfig] = useState({
    key: 'currentScore',
    direction: 'desc',
  });

  // Sort patients based on current sort configuration
  const sortedPatients = [...patients].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  const exportToExcel = () => {
    // Create a copy of the patients data for export
    const exportData = patients.map(patient => ({
      'First Name': patient.firstName,
      'Last Name': patient.lastName,
      'Email': patient.email,
      'Phone': patient.phone,
      'Preferred Communication': patient.communicationMethod,
      'Current Engagement Score': patient.currentScore,
      'Average Engagement Score': patient.averageScore
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');
    XLSX.writeFile(workbook, 'patient_engagement_data.xlsx');
  };

  // Function to determine the color class based on score
  const getScoreColorClass = (score) => {
    if (score >= 41) return 'text-green-600 bg-green-100';
    if (score >= 31) return 'text-blue-600 bg-blue-100';
    if (score >= 21) return 'text-yellow-600 bg-yellow-100';
    if (score >= 11) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  // Toggle patient selection for GHL integration
  const togglePatientSelection = (patient) => {
    if (!setSelectedPatients) return;
    
    if (selectedPatients.some(p => p.id === patient.id)) {
      setSelectedPatients(selectedPatients.filter(p => p.id !== patient.id));
    } else {
      setSelectedPatients([...selectedPatients, patient]);
    }
  };

  // Check if a patient is selected
  const isPatientSelected = (patientId) => {
    return selectedPatients.some(p => p.id === patientId);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Patient List</h3>
        <div className="flex space-x-2">
          {setSelectedPatients && (
            <button
              onClick={() => setSelectedPatients([])}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center"
            >
              Clear Selection ({selectedPatients.length})
            </button>
          )}
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export to Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {setSelectedPatients && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
              )}
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('firstName')}
              >
                First Name{getSortIndicator('firstName')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('lastName')}
              >
                Last Name{getSortIndicator('lastName')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('email')}
              >
                Email{getSortIndicator('email')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('phone')}
              >
                Phone{getSortIndicator('phone')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('communicationMethod')}
              >
                Preferred Communication{getSortIndicator('communicationMethod')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('currentScore')}
              >
                Current Engagement Score{getSortIndicator('currentScore')}
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => requestSort('averageScore')}
              >
                Average Engagement Score{getSortIndicator('averageScore')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPatients.length > 0 ? (
              sortedPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className={`hover:bg-gray-50 ${isPatientSelected(patient.id) ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedPatients && togglePatientSelection(patient)}
                >
                  {setSelectedPatients && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded border flex items-center justify-center ${
                          isPatientSelected(patient.id) 
                            ? 'bg-blue-600 border-blue-600' 
                            : 'border-gray-300'
                        }`}>
                          {isPatientSelected(patient.id) && (
                            <CheckIcon className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.firstName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.communicationMethod}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColorClass(patient.currentScore)}`}>
                      {patient.currentScore}/50
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreColorClass(patient.averageScore)}`}>
                      {patient.averageScore}/50
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={setSelectedPatients ? "8" : "7"} className="px-6 py-4 text-center text-sm text-gray-500">
                  No patients found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 