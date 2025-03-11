import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests (OAuth redirects are GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, locationId } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // Exchange the authorization code for an access token
    const tokenResponse = await exchangeCodeForToken(code as string);

    if (!tokenResponse.success) {
      return res.status(400).json({ error: tokenResponse.error });
    }

    // Redirect to the dashboard with the access token and location ID
    const redirectUrl = `/ghl-dashboard?token=${tokenResponse.access_token}`;
    
    // Add locationId to the redirect URL if it exists
    const finalRedirectUrl = locationId 
      ? `${redirectUrl}&locationId=${locationId}` 
      : redirectUrl;

    return res.redirect(finalRedirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function exchangeCodeForToken(code: string) {
  const clientId = process.env.GHL_CLIENT_ID;
  const clientSecret = process.env.GHL_CLIENT_SECRET;
  const redirectUri = process.env.GHL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return { success: false, error: 'Missing GoHighLevel API credentials' };
  }

  try {
    const response = await fetch('https://services.leadconnectorhq.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: `GoHighLevel auth error: ${errorData.error}` };
    }

    const tokenData = await response.json();
    return { success: true, ...tokenData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error exchanging code for token' 
    };
  }
} 