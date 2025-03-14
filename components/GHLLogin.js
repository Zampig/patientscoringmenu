import { useState, useEffect } from 'react';
import { getAuthUrl, isAuthenticated, getLocationId } from '../utils/auth';

export default function GHLLogin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [authUrl, setAuthUrl] = useState('');

  useEffect(() => {
    // Check if the user is authenticated
    const auth = isAuthenticated();
    setAuthenticated(auth);
    
    // Get the location ID
    const locId = getLocationId();
    setLocationId(locId || '');
    
    // Get the authorization URL
    setAuthUrl(getAuthUrl());
  }, []);

  return (
    <div className="card mb-6 bg-white shadow-sm rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">GoHighLevel Integration</h3>
      
      {authenticated ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Connected to GoHighLevel {locationId ? `(Location ID: ${locationId})` : ''}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Not connected to GoHighLevel. Please authenticate to use the integration features.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        {!authenticated && (
          <a
            href={authUrl}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Connect to GoHighLevel
          </a>
        )}
        
        {authenticated && (
          <button
            onClick={() => {
              // Clear cookies and reload
              document.cookie = 'ghl_access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              document.cookie = 'ghl_refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              document.cookie = 'ghl_location_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              window.location.reload();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
} 