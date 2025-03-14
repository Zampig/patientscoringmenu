import axios from 'axios';

// Base URL for GoHighLevel API
const GHL_BASE_URL = 'https://rest.gohighlevel.com/v1';

// Initialize axios instance with base URL and default headers
const ghlApiClient = axios.create({
  baseURL: GHL_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set the auth token for all requests
export const setAuthToken = (token) => {
  if (token) {
    ghlApiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete ghlApiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Create an API client with the provided access token
 * @param {string} accessToken - GoHighLevel access token
 * @returns {Object} - API client object with methods for interacting with GHL API
 */
export const createGhlApiClient = (accessToken) => {
  // Create axios instance with default headers
  const apiClient = axios.create({
    baseURL: GHL_BASE_URL,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  return {
    /**
     * Get contacts from GoHighLevel
     * @param {string} locationId - Location ID
     * @param {Object} params - Query parameters
     * @returns {Promise<Array>} - Array of contacts
     */
    getContacts: async (locationId, params = {}) => {
      try {
        const response = await apiClient.get(`/locations/${locationId}/contacts`, { params });
        return response.data.contacts || [];
      } catch (error) {
        console.error('Error fetching contacts:', error);
        throw error;
      }
    },

    /**
     * Get contact by ID
     * @param {string} locationId - Location ID
     * @param {string} contactId - Contact ID
     * @returns {Promise<Object>} - Contact object
     */
    getContactById: async (locationId, contactId) => {
      try {
        const response = await apiClient.get(`/locations/${locationId}/contacts/${contactId}`);
        return response.data.contact || null;
      } catch (error) {
        console.error('Error fetching contact:', error);
        throw error;
      }
    },

    /**
     * Get custom field values for a contact
     * @param {string} locationId - Location ID
     * @param {string} contactId - Contact ID
     * @returns {Promise<Object>} - Custom field values
     */
    getContactCustomFields: async (locationId, contactId) => {
      try {
        const response = await apiClient.get(`/locations/${locationId}/contacts/${contactId}/custom-field-values`);
        return response.data.values || {};
      } catch (error) {
        console.error('Error fetching custom fields:', error);
        throw error;
      }
    },

    /**
     * Get custom fields for a location
     * @param {string} locationId - Location ID
     * @returns {Promise<Array>} - Array of custom fields
     */
    getCustomFields: async (locationId) => {
      try {
        const response = await apiClient.get(`/locations/${locationId}/custom-fields`);
        return response.data.customFields || [];
      } catch (error) {
        console.error('Error fetching custom fields:', error);
        throw error;
      }
    },
  };
};

/**
 * Process contacts data to extract engagement scores
 * @param {Array} contacts - Array of contacts from GHL
 * @param {Array} customFields - Array of custom fields from GHL
 * @returns {Array} - Processed contacts with engagement scores
 */
export const processContactsData = (contacts, customFields) => {
  // Find the IDs of our custom fields
  const currentScoreFieldId = customFields.find(field => field.name === 'current_engagement_score')?.id;
  const averageScoreFieldId = customFields.find(field => field.name === 'average_engagement_score')?.id;
  const communicationMethodFieldId = customFields.find(field => field.name === 'preferred_communication_method')?.id;

  // Process each contact
  return contacts.map(contact => {
    // Extract custom field values
    const currentScore = parseInt(contact.customField?.[currentScoreFieldId] || '0', 10);
    const averageScore = parseInt(contact.customField?.[averageScoreFieldId] || '0', 10);
    const communicationMethod = contact.customField?.[communicationMethodFieldId] || 'Not specified';

    return {
      id: contact.id,
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || 'Unknown',
      email: contact.email || 'No email',
      phone: contact.phone || 'No phone',
      communicationMethod,
      currentScore,
      averageScore,
      // Add any other fields you need
    };
  });
};

/**
 * Group contacts by score range
 * @param {Array} contacts - Processed contacts with engagement scores
 * @param {string} scoreType - 'currentScore' or 'averageScore'
 * @returns {Object} - Contacts grouped by score range
 */
export const groupContactsByScoreRange = (contacts, scoreType = 'currentScore') => {
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
    contacts: ranges.map(() => []),
  };

  contacts.forEach(contact => {
    const score = contact[scoreType];
    
    for (let i = 0; i < ranges.length; i++) {
      const { min, max } = ranges[i];
      if (score >= min && score <= max) {
        result.values[i]++;
        result.contacts[i].push(contact);
        break;
      }
    }
  });

  return result;
};

/**
 * Filter contacts based on filter criteria
 * @param {Array} contacts - Processed contacts
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered contacts
 */
export const filterContacts = (contacts, filters) => {
  return contacts.filter(contact => {
    // Filter by score range
    if (filters.scoreRange) {
      const [min, max] = filters.scoreRange.split('-').map(Number);
      if (contact.currentScore < min || contact.currentScore > max) {
        return false;
      }
    }

    // Filter by communication method
    if (filters.communicationMethod && contact.communicationMethod.toLowerCase() !== filters.communicationMethod) {
      return false;
    }

    // Filter by search term
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const name = contact.name.toLowerCase();
      const email = contact.email.toLowerCase();
      const phone = contact.phone.toLowerCase();
      
      if (!name.includes(searchTerm) && !email.includes(searchTerm) && !phone.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
};

/**
 * Calculate average score for a group of contacts
 * @param {Array} contacts - Processed contacts
 * @param {string} scoreType - 'currentScore' or 'averageScore'
 * @returns {number} - Average score
 */
export const calculateAverageScore = (contacts, scoreType = 'currentScore') => {
  if (!contacts.length) return 0;
  
  const sum = contacts.reduce((acc, contact) => acc + contact[scoreType], 0);
  return Math.round((sum / contacts.length) * 10) / 10; // Round to 1 decimal place
};

// Fetch all available workflows for a location
export const fetchWorkflows = async (locationId) => {
  try {
    const response = await ghlApiClient.get(`/locations/${locationId}/workflows`);
    return response.data.workflows || [];
  } catch (error) {
    console.error('Error fetching workflows:', error);
    throw error;
  }
};

// Fetch all available pipelines for a location
export const fetchPipelines = async (locationId) => {
  try {
    const response = await ghlApiClient.get(`/locations/${locationId}/pipelines`);
    return response.data.pipelines || [];
  } catch (error) {
    console.error('Error fetching pipelines:', error);
    throw error;
  }
};

// Add contacts to a workflow
export const addContactsToWorkflow = async (locationId, workflowId, contactIds) => {
  try {
    const response = await ghlApiClient.post(`/locations/${locationId}/workflows/${workflowId}/contacts`, {
      contactIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding contacts to workflow:', error);
    throw error;
  }
};

// Add contacts to a pipeline
export const addContactsToPipeline = async (locationId, pipelineId, stageId, contactIds) => {
  try {
    const response = await ghlApiClient.post(`/locations/${locationId}/pipelines/${pipelineId}/stages/${stageId}/contacts`, {
      contactIds,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding contacts to pipeline:', error);
    throw error;
  }
};

// Generate a trigger link for a contact
export const generateTriggerLink = async (locationId, triggerId, contactId) => {
  try {
    const response = await ghlApiClient.post(`/locations/${locationId}/triggers/${triggerId}/contact/${contactId}`);
    return response.data.triggerLink;
  } catch (error) {
    console.error('Error generating trigger link:', error);
    throw error;
  }
};

// Fetch all tags for a location
export const fetchTags = async (locationId) => {
  try {
    const response = await ghlApiClient.get(`/locations/${locationId}/tags`);
    return response.data.tags || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// Create a new tag in a location
export const createTag = async (locationId, tagName, color = '#3498db') => {
  try {
    const response = await ghlApiClient.post(`/locations/${locationId}/tags`, {
      name: tagName,
      color: color
    });
    return response.data.tag;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

// Add tags to contacts
export const addTagsToContacts = async (locationId, contactIds, tagIds) => {
  try {
    const response = await ghlApiClient.post(`/locations/${locationId}/contacts/tags`, {
      contactIds: contactIds,
      tagIds: tagIds
    });
    return response.data;
  } catch (error) {
    console.error('Error adding tags to contacts:', error);
    throw error;
  }
};

// Remove tags from contacts
export const removeTagsFromContacts = async (locationId, contactIds, tagIds) => {
  try {
    const response = await ghlApiClient.delete(`/locations/${locationId}/contacts/tags`, {
      data: {
        contactIds: contactIds,
        tagIds: tagIds
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error removing tags from contacts:', error);
    throw error;
  }
};

// Initialize the API with token from environment variables or cookies
export const initializeApi = () => {
  // First try to get token from cookies (for authenticated users)
  if (typeof window !== 'undefined') {
    try {
      // Import dynamically to avoid circular dependencies
      const { getAccessToken } = require('./auth');
      const token = getAccessToken();
      
      if (token) {
        setAuthToken(token);
        return true;
      }
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  }
  
  // Fallback to environment variable (for development/testing)
  const token = process.env.NEXT_PUBLIC_GHL_API_TOKEN;
  if (token) {
    setAuthToken(token);
    return true;
  }
  
  return false;
};

export default {
  setAuthToken,
  fetchWorkflows,
  fetchPipelines,
  addContactsToWorkflow,
  addContactsToPipeline,
  generateTriggerLink,
  fetchTags,
  createTag,
  addTagsToContacts,
  removeTagsFromContacts,
  initializeApi,
}; 