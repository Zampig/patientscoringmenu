import { createGhlApiClient, processContactsData, filterContacts } from '../../utils/ghlApi';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { locationId, accessToken, filters = {} } = req.query;

    // Validate required parameters
    if (!locationId || !accessToken) {
      return res.status(400).json({ error: 'Missing required parameters: locationId and accessToken' });
    }

    // Create GoHighLevel API client
    const ghlApi = createGhlApiClient(accessToken);

    // Fetch custom fields first to get the field IDs
    const customFields = await ghlApi.getCustomFields(locationId);

    // Fetch contacts from GoHighLevel
    const contacts = await ghlApi.getContacts(locationId, {
      limit: 100, // Adjust as needed
    });

    // Process contacts to extract engagement scores
    const processedContacts = processContactsData(contacts, customFields);

    // Apply filters if provided
    const filteredContacts = filters ? filterContacts(processedContacts, JSON.parse(filters)) : processedContacts;

    // Return the processed and filtered contacts
    return res.status(200).json({ 
      success: true,
      patients: filteredContacts,
      total: filteredContacts.length,
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch patients',
      message: error.message,
    });
  }
} 