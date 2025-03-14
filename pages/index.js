import { useState, useEffect } from 'react';
import { ChartBarIcon, UserGroupIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import Layout from '../components/Layout';
import SummaryCard from '../components/SummaryCard';
import EngagementPieChart from '../components/EngagementPieChart';
import EngagementBarChart from '../components/EngagementBarChart';
import FilterPanel from '../components/FilterPanel';
import DateRangeFilter from '../components/DateRangeFilter';
import PatientList from '../components/PatientList';
import GHLIntegration from '../components/GHLIntegration';
import TagManager from '../components/TagManager';
import GHLLogin from '../components/GHLLogin';
import { isAuthenticated } from '../utils/auth';
import { 
  generateMockPatients, 
  generateMockSummary, 
  groupMockPatientsByScoreRange,
  filterMockPatients
} from '../utils/mockData';

export default function Dashboard() {
  // State for patients data
  const [allPatients, setAllPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatients, setSelectedPatients] = useState([]);
  
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
  
  // State for GHL integration tabs
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow', 'tags'
  
  // State for authentication
  const [authenticated, setAuthenticated] = useState(false);
  
  // Check if we're in the GHL embed context
  const [isGHLEmbed, setIsGHLEmbed] = useState(false);
  
  // Load mock data on component mount
  useEffect(() => {
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
    
    // Check if we're in GHL embed context
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setIsGHLEmbed(!!params.get('locationId') && !!params.get('access_token'));
      
      // Check if the user is authenticated
      setAuthenticated(isAuthenticated());
    }
  }, []);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Apply filters to patients
    const filtered = filterMockPatients(allPatients, newFilters);
    setFilteredPatients(filtered);
    
    // Clear selected patients when filters change
    setSelectedPatients([]);
    
    // Update summary and chart data based on filtered patients
    const newSummary = generateMockSummary(filtered);
    setSummary(newSummary);
    
    const newPieChartData = groupMockPatientsByScoreRange(filtered, 'currentScore');
    setPieChartData(newPieChartData);
    
    const newBarChartData = groupMockPatientsByScoreRange(filtered, 'averageScore');
    setBarChartData(newBarChartData);
  };
  
  // Handle date range changes
  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
    // In a real application, you would fetch data for the selected date range
    // For now, we'll just log the date range
    console.log('Date range changed:', newDateRange);
  };
  
  return (
    <Layout title="Patient Engagement Dashboard">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Patient Engagement Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor and analyze patient engagement scores to improve patient retention and satisfaction.
        </p>
      </div>
      
      {/* GoHighLevel Login */}
      <GHLLogin />
      
      {/* Date Range Filter */}
      <DateRangeFilter onDateChange={handleDateChange} />
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard 
          title="Total Patients" 
          value={summary.totalPatients} 
          icon={<UserGroupIcon className="h-6 w-6" />} 
        />
        <SummaryCard 
          title="Average Current Engagement Score" 
          value={`${summary.averageCurrentScore}/50`} 
          icon={<ChartBarIcon className="h-6 w-6" />} 
          change={summary.scoreChange} 
          changeType={summary.changeType} 
        />
        <SummaryCard 
          title="Average Historical Engagement Score" 
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
      
      {/* GHL Integration Tabs (only show if authenticated or in GHL embed context or if we have selected patients) */}
      {(authenticated || isGHLEmbed || selectedPatients.length > 0) && (
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('workflow')}
                className={`${
                  activeTab === 'workflow'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Workflows & Pipelines
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`${
                  activeTab === 'tags'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Tags
              </button>
            </nav>
          </div>
          
          {activeTab === 'workflow' && (
            <GHLIntegration 
              patients={filteredPatients} 
              selectedPatients={selectedPatients} 
              setSelectedPatients={setSelectedPatients} 
            />
          )}
          
          {activeTab === 'tags' && (
            <TagManager 
              patients={filteredPatients} 
              selectedPatients={selectedPatients} 
              setSelectedPatients={setSelectedPatients} 
            />
          )}
        </div>
      )}
      
      {/* Patient List */}
      <PatientList 
        patients={filteredPatients} 
        selectedPatients={selectedPatients}
        setSelectedPatients={setSelectedPatients}
      />
    </Layout>
  );
} 