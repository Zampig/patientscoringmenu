import axios from 'axios';
import { parse } from 'cookie';

export default async function handler(req, res) {
  // Get the refresh token from cookies
  const cookies = parse(req.headers.cookie || '');
  const refreshToken = cookies.ghl_refresh_token;
  const locationId = cookies.ghl_location_id;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token not found' });
  }

  try {
    // Exchange the refresh token for a new access token
    const tokenResponse = await axios.post('https://services.leadconnectorhq.com/oauth/token', {
      client_id: process.env.GHL_CLIENT_ID,
      client_secret: process.env.GHL_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Update the cookies with the new tokens
    res.setHeader('Set-Cookie', [
      `ghl_access_token=${access_token}; Path=/; HttpOnly; Max-Age=${expires_in}`,
      `ghl_refresh_token=${refresh_token || refreshToken}; Path=/; HttpOnly; Max-Age=31536000`, // 1 year
    ]);

    // Return the new access token and location ID
    res.status(200).json({ 
      access_token, 
      location_id: locationId 
    });
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
} 