import axios from 'axios';
import { parse } from 'cookie';

// Function to get the GoHighLevel authorization URL
export const getAuthUrl = (redirectUri = process.env.GHL_REDIRECT_URI) => {
  const clientId = process.env.GHL_CLIENT_ID;
  const scopes = [
    'contacts.readonly',
    'contacts.write',
    'locations.readonly',
    'tags.readonly',
    'tags.write',
    'workflows.readonly',
    'workflows.write',
    'pipelines.readonly',
    'pipelines.write'
  ].join(' ');

  return `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
};

// Function to get the access token from cookies on the client side
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  
  const cookies = parse(document.cookie || '');
  return cookies.ghl_access_token;
};

// Function to get the location ID from cookies or URL on the client side
export const getLocationId = () => {
  if (typeof window === 'undefined') return null;
  
  // First check URL parameters
  const params = new URLSearchParams(window.location.search);
  const locationIdFromUrl = params.get('locationId');
  
  if (locationIdFromUrl) return locationIdFromUrl;
  
  // Then check cookies
  const cookies = parse(document.cookie || '');
  return cookies.ghl_location_id || process.env.NEXT_PUBLIC_GHL_DEFAULT_LOCATION_ID;
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  return !!getAccessToken();
};

// Function to refresh the access token
export const refreshToken = async () => {
  try {
    const response = await axios.get('/api/refresh-token');
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Function to initialize the API client with the current token
export const initializeApiWithToken = () => {
  const token = getAccessToken();
  if (token) {
    // Import dynamically to avoid circular dependencies
    const { setAuthToken } = require('./ghlApi');
    setAuthToken(token);
    return true;
  }
  return false;
}; 