import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

// Dynamically import chart components to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Types for our data
type PatientScore = {
  id: string;
  name: string;
  email: string;
  currentScore: number;
  averageScore: number;
  scoreHistory: { date: string; score: number }[];
};

type DashboardData = {
  data: PatientScore[];
  averageLocationScore: number;
};

const GHLDashboard: React.FC = () => {
  const router = useRouter();
  const { locationId, token } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientScore | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  // Fetch data from our API
  useEffect(() => {
    const fetchData = async () => {
      if (!locationId || !token) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/ghl-integration', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'getPatientScores',
            locationId,
            accessToken: token,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setDashboardData(data);
        
        // Set the first patient as selected by default
        if (data.data.length > 0) {
          setSelectedPatient(data.data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locationId, token]);

  // For demo purposes, let's simulate data without actual API calls
  useEffect(() => {
    if (!locationId && !token) {
      // Demo data for preview
      const demoData = {
        success: true,
        data: [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@example.com',
            currentScore: 85,
            averageScore: 78,
            scoreHistory: [
              { date: '2023-01-01', score: 65 },
              { date: '2023-02-01', score: 72 },
              { date: '2023-03-01', score: 78 },
              { date: '2023-04-01', score: 85 },
            ],
          },
          {
            id: '2',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            currentScore: 62,
            averageScore: 70,
            scoreHistory: [
              { date: '2023-01-01', score: 75 },
              { date: '2023-02-01', score: 72 },
              { date: '2023-03-01', score: 68 },
              { date: '2023-04-01', score: 62 },
            ],
          },
          {
            id: '3',
            name: 'Robert Johnson',
            email: 'robert.johnson@example.com',
            currentScore: 92,
            averageScore: 85,
            scoreHistory: [
              { date: '2023-01-01', score: 78 },
              { date: '2023-02-01', score: 82 },
              { date: '2023-03-01', score: 88 },
              { date: '2023-04-01', score: 92 },
            ],
          },
        ],
        averageLocationScore: 79.7,
      };
      
      setDashboardData(demoData);
      setSelectedPatient(demoData.data[0]);
      setLoading(false);
    }
  }, [locationId, token]);

  // Get score color based on value
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get score background color based on value
  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Get gauge chart options
  const getGaugeOptions = (score: number) => {
    return {
      chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: "#e7e7e7",
            strokeWidth: '97%',
            margin: 5,
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              color: '#999',
              opacity: 1,
              blur: 2
            }
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              offsetY: -2,
              fontSize: '22px'
            }
          }
        }
      },
      grid: {
        padding: {
          top: -10
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          shadeIntensity: 0.4,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 53, 91]
        },
      },
      colors: [score >= 80 ? '#10B981' : score >= 50 ? '#F59E0B' : '#EF4444'],
      labels: ['Patient Score'],
    };
  };

  // Get line chart options for score history
  const getLineChartOptions = (patient: PatientScore) => {
    return {
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: patient.scoreHistory.map(h => h.date),
        labels: {
          formatter: function(value: string) {
            return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Engagement Score'
        }
      },
      colors: [patient.currentScore >= 80 ? '#10B981' : patient.currentScore >= 50 ? '#F59E0B' : '#EF4444'],
      tooltip: {
        y: {
          formatter: function(value: number) {
            return value.toString();
          }
        }
      }
    };
  };

  // Get comparison chart options
  const getComparisonChartOptions = () => {
    return {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Current Score', 'Average Score', 'Location Average'],
      },
      yaxis: {
        min: 0,
        max: 100,
        title: {
          text: 'Score'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val: number) {
            return val.toString();
          }
        }
      }
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData || !selectedPatient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Data Available</h2>
          <p className="text-gray-600">There is no patient engagement data available for this location.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <Head>
        <title>Patient Engagement Scoring | GoHighLevel</title>
        <meta name="description" content="Patient engagement scoring dashboard for chiropractic practices" />
      </Head>

      <div className="container mx-auto px-4">
        {/* Header with date filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
            Patient Engagement Scoring
          </h1>
          
          <div className="flex space-x-4">
            <div className="flex items-center">
              <label htmlFor="start-date" className="mr-2 text-sm font-medium text-gray-700">From:</label>
              <input
                type="date"
                id="start-date"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            
            <div className="flex items-center">
              <label htmlFor="end-date" className="mr-2 text-sm font-medium text-gray-700">To:</label>
              <input
                type="date"
                id="end-date"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Location Average Score</h2>
            <div className="flex items-center">
              <div className={`text-4xl font-bold ${getScoreColor(dashboardData.averageLocationScore)}`}>
                {dashboardData.averageLocationScore.toFixed(1)}
              </div>
              <div className="ml-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${dashboardData.averageLocationScore >= 80 ? 'bg-green-600' : dashboardData.averageLocationScore >= 50 ? 'bg-yellow-500' : 'bg-red-600'}`}
                    style={{ width: `${dashboardData.averageLocationScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Patients</h2>
            <div className="text-4xl font-bold text-primary-600">{dashboardData.data.length}</div>
            <div className="mt-2 text-sm text-gray-500">
              With engagement scoring data
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">High Engagement Patients</h2>
            <div className="text-4xl font-bold text-green-600">
              {dashboardData.data.filter(p => p.currentScore >= 80).length}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {((dashboardData.data.filter(p => p.currentScore >= 80).length / dashboardData.data.length) * 100).toFixed(1)}% of total patients
            </div>
          </div>
        </div>
        
        {/* Patient Selection and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Patient List</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dashboardData.data.map((patient) => (
                <div 
                  key={patient.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedPatient.id === patient.id 
                      ? 'bg-primary-100 border-l-4 border-primary-600' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="font-medium">{patient.name}</div>
                  <div className="text-sm text-gray-500">{patient.email}</div>
                  <div className="flex items-center mt-1">
                    <div className={`text-sm font-semibold ${getScoreColor(patient.currentScore)}`}>
                      Score: {patient.currentScore}
                    </div>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${patient.currentScore >= 80 ? 'bg-green-600' : patient.currentScore >= 50 ? 'bg-yellow-500' : 'bg-red-600'}`}
                        style={{ width: `${patient.currentScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedPatient.name}</h2>
                <p className="text-gray-500">{selectedPatient.email}</p>
              </div>
              
              <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full ${getScoreBgColor(selectedPatient.currentScore)}`}>
                <span className={`font-semibold ${getScoreColor(selectedPatient.currentScore)}`}>
                  Current Score: {selectedPatient.currentScore}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gauge Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Current Engagement Score</h3>
                <div className="h-64">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={getGaugeOptions(selectedPatient.currentScore)}
                      series={[selectedPatient.currentScore]}
                      type="radialBar"
                      height="100%"
                    />
                  )}
                </div>
              </div>
              
              {/* Comparison Chart */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Score Comparison</h3>
                <div className="h-64">
                  {typeof window !== 'undefined' && (
                    <Chart
                      options={getComparisonChartOptions()}
                      series={[{
                        name: 'Score',
                        data: [
                          selectedPatient.currentScore,
                          selectedPatient.averageScore,
                          dashboardData.averageLocationScore
                        ]
                      }]}
                      type="bar"
                      height="100%"
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Score History Chart */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Score History</h3>
              <div className="h-64">
                {typeof window !== 'undefined' && (
                  <Chart
                    options={getLineChartOptions(selectedPatient)}
                    series={[{
                      name: 'Engagement Score',
                      data: selectedPatient.scoreHistory.map(h => h.score)
                    }]}
                    type="line"
                    height="100%"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Engagement Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Patient Engagement Distribution</h2>
          <div className="h-64">
            {typeof window !== 'undefined' && (
              <Chart
                options={{
                  chart: {
                    type: 'bar',
                    toolbar: {
                      show: false
                    }
                  },
                  plotOptions: {
                    bar: {
                      distributed: true,
                      borderRadius: 5,
                      horizontal: true,
                    }
                  },
                  colors: ['#EF4444', '#F59E0B', '#10B981'],
                  dataLabels: {
                    enabled: false
                  },
                  xaxis: {
                    categories: ['Low (0-49)', 'Medium (50-79)', 'High (80-100)'],
                  },
                  legend: {
                    show: false
                  }
                }}
                series={[{
                  name: 'Patients',
                  data: [
                    dashboardData.data.filter(p => p.currentScore < 50).length,
                    dashboardData.data.filter(p => p.currentScore >= 50 && p.currentScore < 80).length,
                    dashboardData.data.filter(p => p.currentScore >= 80).length
                  ]
                }]}
                type="bar"
                height="100%"
              />
            )}
          </div>
        </div>
        
        {/* Footer with attribution */}
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            Patient Engagement Scoring Dashboard | Powered by Chiropractic Lead Scoring System
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} Chiropractic Wellness Center. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GHLDashboard; 