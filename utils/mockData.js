/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random engagement score between 0 and 50
 * @returns {number} - Random engagement score
 */
const getRandomScore = () => getRandomInt(0, 50);

/**
 * Generate a random communication method
 * @returns {string} - Random communication method
 */
const getRandomCommunicationMethod = () => {
  const methods = ['email', 'phone', 'text'];
  return methods[getRandomInt(0, methods.length - 1)];
};

/**
 * Generate mock patient data
 * @param {number} count - Number of patients to generate
 * @returns {Array} - Array of mock patients
 */
export const generateMockPatients = (count = 50) => {
  const patients = [];
  
  for (let i = 1; i <= count; i++) {
    const currentScore = getRandomScore();
    // Generate an average score that's somewhat related to the current score
    const averageScore = Math.min(50, Math.max(0, currentScore + getRandomInt(-5, 5)));
    
    patients.push({
      id: `patient-${i}`,
      firstName: `John${i}`,
      lastName: `Doe${i}`,
      email: `patient${i}@example.com`,
      phone: `(555) ${100 + i}-${1000 + i}`,
      communicationMethod: getRandomCommunicationMethod(),
      currentScore,
      averageScore,
    });
  }
  
  return patients;
};

/**
 * Generate mock summary data
 * @param {Array} patients - Array of patients
 * @returns {Object} - Summary data
 */
export const generateMockSummary = (patients) => {
  const totalPatients = patients.length;
  
  // Calculate average scores
  const totalCurrentScore = patients.reduce((sum, patient) => sum + patient.currentScore, 0);
  const totalAverageScore = patients.reduce((sum, patient) => sum + patient.averageScore, 0);
  
  const averageCurrentScore = totalPatients > 0 ? Math.round((totalCurrentScore / totalPatients) * 10) / 10 : 0;
  const averageHistoricalScore = totalPatients > 0 ? Math.round((totalAverageScore / totalPatients) * 10) / 10 : 0;
  
  // Calculate score change
  const scoreChange = (averageCurrentScore - averageHistoricalScore).toFixed(1);
  const changeType = scoreChange >= 0 ? 'increase' : 'decrease';
  
  return {
    totalPatients,
    averageCurrentScore,
    averageHistoricalScore,
    scoreChange: Math.abs(scoreChange),
    changeType,
  };
};

/**
 * Group mock patients by score range
 * @param {Array} patients - Array of patients
 * @param {string} scoreType - 'currentScore' or 'averageScore'
 * @returns {Object} - Grouped data for charts
 */
export const groupMockPatientsByScoreRange = (patients, scoreType = 'currentScore') => {
  const ranges = [
    { min: 0, max: 10, label: '0-10' },
    { min: 11, max: 20, label: '11-20' },
    { min: 21, max: 30, label: '21-30' },
    { min: 31, max: 40, label: '31-40' },
    { min: 41, max: 50, label: '41-50' },
  ];
  
  const result = {
    labels: ranges.map(range => range.label),
    values: Array(ranges.length).fill(0),
  };
  
  patients.forEach(patient => {
    const score = patient[scoreType];
    
    for (let i = 0; i < ranges.length; i++) {
      const { min, max } = ranges[i];
      if (score >= min && score <= max) {
        result.values[i]++;
        break;
      }
    }
  });
  
  return result;
};

/**
 * Filter mock patients based on filter criteria
 * @param {Array} patients - Array of patients
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered patients
 */
export const filterMockPatients = (patients, filters) => {
  return patients.filter(patient => {
    // Filter by score range
    if (filters.scoreRange) {
      const [min, max] = filters.scoreRange.split('-').map(Number);
      if (patient.currentScore < min || patient.currentScore > max) {
        return false;
      }
    }
    
    // Filter by communication method
    if (filters.communicationMethod && patient.communicationMethod !== filters.communicationMethod) {
      return false;
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const firstName = patient.firstName.toLowerCase();
      const lastName = patient.lastName.toLowerCase();
      const email = patient.email.toLowerCase();
      const phone = patient.phone.toLowerCase();
      
      if (!firstName.includes(searchTerm) && !lastName.includes(searchTerm) && !email.includes(searchTerm) && !phone.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
}; 