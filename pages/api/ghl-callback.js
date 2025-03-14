import axios from 'axios';

export default async function handler(req, res) {
  // Get the authorization code from the query parameters
  const { code, locationId } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post('https://services.leadconnectorhq.com/oauth/token', {
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.GHL_REDIRECT_URI,
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Store the tokens in cookies or session (for this example, we'll use cookies)
    // In a production app, you should store these securely, preferably in a database
    res.setHeader('Set-Cookie', [
      `ghl_access_token=${access_token}; Path=/; HttpOnly; Max-Age=${expires_in}`,
      `ghl_refresh_token=${refresh_token}; Path=/; HttpOnly; Max-Age=31536000`, // 1 year
      `ghl_location_id=${locationId || ''}; Path=/; Max-Age=31536000`, // 1 year
    ]);

    // Redirect back to the dashboard with the location ID
    res.redirect(`/?locationId=${locationId || ''}&authenticated=true`);
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to authenticate with GoHighLevel' });
  }
} 