import type { NextApiRequest, NextApiResponse } from 'next';

type GHLAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, locationId, authCode } = req.body;

    // Handle different actions
    switch (action) {
      case 'auth':
        // Exchange auth code for access token
        const authResponse = await exchangeAuthCode(authCode);
        return res.status(200).json(authResponse);
      
      case 'getPatientScores':
        // Get patient engagement scores for a location
        const { accessToken } = req.body;
        const patientScores = await getPatientScores(locationId, accessToken);
        return res.status(200).json(patientScores);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('GHL Integration error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Exchange authorization code for access token
async function exchangeAuthCode(authCode: string): Promise<GHLAuthResponse> {
  const clientId = process.env.GHL_CLIENT_ID;
  const clientSecret = process.env.GHL_CLIENT_SECRET;
  const redirectUri = process.env.GHL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing GoHighLevel API credentials');
  }

  const response = await fetch('https://services.leadconnectorhq.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code: authCode,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`GoHighLevel auth error: ${errorData.error}`);
  }

  return await response.json();
}

// Get patient engagement scores for a location
async function getPatientScores(locationId: string, accessToken: string) {
  // In a real implementation, you would fetch this data from your database
  // or from GoHighLevel's API based on the custom fields you've created
  
  // For now, we'll return mock data
  return {
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
      // Add more mock patients as needed
    ],
    averageLocationScore: 73.5,
  };
} 