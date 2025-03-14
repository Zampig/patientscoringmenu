import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ChartBarIcon, UsersIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import Layout from '../components/Layout';
import SummaryCard from '../components/SummaryCard';
import EngagementPieChart from '../components/EngagementPieChart';
import EngagementBarChart from '../components/EngagementBarChart';
import FilterPanel from '../components/FilterPanel';
import DateRangeFilter from '../components/DateRangeFilter';
import PatientList from '../components/PatientList';
import { groupContactsByScoreRange, calculateAverageScore } from '../utils/ghlApi';
import { generateMockPatients, generateMockSummary, groupMockPatientsByScoreRange } from '../utils/mockData';

export default function EmbeddedDashboard() {
  const router = useRouter();
  const { locationId, accessToken } = router.query;
  
  // State for loading status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for patients data
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  // State for summary data
  const [summary, setSummary] = useState({
    totalPatients: 0,
    averageCurrentScore: 0,
    averageHistoricalScore: 0,
    scoreChange: 0,
    changeType: 'increase',
  });
  
  // State for chart data
  const [pieChartData, setPieChartData] = useState({ labels: [], values: [] });
  const [barChartData, setBarChartData] = useState({ labels: [], values: [] });
  
  // State for filters
  const [filters, setFilters] = useState({
    scoreRange: '',
    communicationMethod: '',
    searchTerm: '',
  });
  
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  
  // Fetch data from GoHighLevel or use mock data if parameters are missing
  useEffect(() => {
    // Wait for router to be ready before accessing query params
    if (!router.isReady) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we have the required parameters
        if (!locationId || !accessToken) {
          // Use mock data if parameters are missing
          const mockPatients = generateMockPatients(100);
          setAllPatients(mockPatients);
          setFilteredPatients(mockPatients);
          
          // Generate summary data
          const mockSummary = generateMockSummary(mockPatients);
          setSummary(mockSummary);
          
          // Generate chart data
          const mockPieChartData = groupMockPatientsByScoreRange(mockPatients, 'currentScore');
          setPieChartData(mockPieChartData);
          
          const mockBarChartData = groupMockPatientsByScoreRange(mockPatients, 'averageScore');
          setBarChartData(mockBarChartData);
          
          setLoading(false);
          return;
        }
        
        // Fetch data from our API endpoint
        const response = await axios.get(`/api/patients`, {
          params: {
            locationId,
            accessToken,
            filters: JSON.stringify(filters),
          },
        });
        
        const { patients } = response.data;
        
        setAllPatients(patients);
        setFilteredPatients(patients);
        
        // Calculate summary data
        const totalPatients = patients.length;
        const averageCurrentScore = calculateAverageScore(patients, 'currentScore');
        const averageHistoricalScore = calculateAverageScore(patients, 'averageScore');
        const scoreChange = (averageCurrentScore - averageHistoricalScore).toFixed(1);
        const changeType = scoreChange >= 0 ? 'increase' : 'decrease';
        
        setSummary({
          totalPatients,
          averageCurrentScore,
          averageHistoricalScore,
          scoreChange: Math.abs(scoreChange),
          changeType,
        });
        
        // Generate chart data
        const pieData = groupContactsByScoreRange(patients, 'currentScore');
        setPieChartData(pieData);
        
        const barData = groupContactsByScoreRange(patients, 'averageScore');
        setBarChartData(barData);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch patient data. Please try again later.');
        
        // Use mock data as fallback
        const mockPatients = generateMockPatients(100);
        setAllPatients(mockPatients);
        setFilteredPatients(mockPatients);
        
        // Generate summary data
        const mockSummary = generateMockSummary(mockPatients);
        setSummary(mockSummary);
        
        // Generate chart data
        const mockPieChartData = groupMockPatientsByScoreRange(mockPatients, 'currentScore');
        setPieChartData(mockPieChartData);
        
        const mockBarChartData = groupMockPatientsByScoreRange(mockPatients, 'averageScore');
        setBarChartData(mockBarChartData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [router.isReady, locationId, accessToken, JSON.stringify(filters), JSON.stringify(dateRange)]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  // Handle date range changes
  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };
  
  if (loading) {
    return (
      <Layout title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading patient data...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout title="Error">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Showing mock data as a fallback. Please check your connection and try again.
        </p>
        
        {/* Rest of the dashboard with mock data */}
        <DateRangeFilter onDateChange={handleDateChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SummaryCard 
            title="Total Patients" 
            value={summary.totalPatients} 
            icon={<UsersIcon className="h-6 w-6" />} 
          />
          <SummaryCard 
            title="Average Current Score" 
            value={`${summary.averageCurrentScore}/50`} 
            icon={<ChartBarIcon className="h-6 w-6" />} 
            change={summary.scoreChange} 
            changeType={summary.changeType} 
          />
          <SummaryCard 
            title="Average Historical Score" 
            value={`${summary.averageHistoricalScore}/50`} 
            icon={<ArrowTrendingUpIcon className="h-6 w-6" />} 
          />
        </div>
        
        <FilterPanel onFilterChange={handleFilterChange} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <EngagementPieChart data={pieChartData} />
          <EngagementBarChart data={barChartData} />
        </div>
        
        <PatientList patients={filteredPatients} />
      </Layout>
    );
  }
  
  return (
    <Layout title="Patient Engagement Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Engagement Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor and analyze patient engagement scores to improve patient retention and satisfaction.
        </p>
      </div>
      
      {/* Date Range Filter */}
      <DateRangeFilter onDateChange={handleDateChange} />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard 
          title="Total Patients" 
          value={summary.totalPatients} 
          icon={<UsersIcon className="h-6 w-6" />} 
        />
        <SummaryCard 
          title="Average Current Score" 
          value={`${summary.averageCurrentScore}/50`} 
          icon={<ChartBarIcon className="h-6 w-6" />} 
          change={summary.scoreChange} 
          changeType={summary.changeType} 
        />
        <SummaryCard 
          title="Average Historical Score" 
          value={`${summary.averageHistoricalScore}/50`} 
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />} 
        />
      </div>
      
      {/* Filter Panel */}
      <FilterPanel onFilterChange={handleFilterChange} />
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <EngagementPieChart data={pieChartData} />
        <EngagementBarChart data={barChartData} />
      </div>
      
      {/* Patient List */}
      <PatientList patients={filteredPatients} />
    </Layout>
  );
} 