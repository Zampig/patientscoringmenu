# GoHighLevel Integration Guide for Patient Engagement Scoring

This guide will walk you through the process of integrating the Patient Engagement Scoring dashboard with your GoHighLevel account.

## Overview

The Patient Engagement Scoring dashboard provides a visual representation of patient engagement metrics collected through your chiropractic lead scoring system. It allows you to:

- View individual patient engagement scores
- Track score history over time
- Compare scores across patients
- Filter data by date ranges
- Identify high-risk and high-value patients

## Prerequisites

1. A GoHighLevel account with admin access
2. A deployed instance of the Chiropractic Lead Scoring System
3. API credentials from GoHighLevel

## Step 1: Create a Custom App in GoHighLevel

1. Log in to your GoHighLevel account
2. Navigate to Settings > Agency Settings > Marketplace > Developer Portal
3. Click "Create New App"
4. Fill in the following details:
   - App Name: Patient Engagement Scoring
   - Description: Track and visualize patient engagement metrics
   - App Logo: Upload a logo for your app
   - Redirect URL: `https://your-domain.com/api/ghl-callback`
   - Webhook URL: `https://your-domain.com/api/ghl-integration`
   - Permissions: Request the following scopes:
     - `contacts.readonly`
     - `locations.readonly`
     - `custom_values.readonly`
     - `custom_fields.readonly`
5. Click "Create App"
6. Note your Client ID and Client Secret

## Step 2: Configure Your Environment Variables

Update your `.env.local` file with the following variables:

```
GHL_CLIENT_ID=your_client_id_from_step_1
GHL_CLIENT_SECRET=your_client_secret_from_step_1
GHL_REDIRECT_URI=https://your-domain.com/api/ghl-callback
```

## Step 3: Create Custom Fields in GoHighLevel

1. In GoHighLevel, go to Settings > Custom Fields
2. Create the following custom fields for contacts:
   - `lead_score` (Number): The overall engagement score
   - `pain_level` (Number): Patient's reported pain level
   - `satisfaction_level` (Number): Patient's satisfaction with treatment
   - `improvement_rate` (Number): Patient's reported improvement rate
   - `likelihood_to_return` (Number): Likelihood of patient returning
   - `referral_potential` (Number): Likelihood of patient referring others
   - `additional_services` (Text): Services the patient is interested in

## Step 4: Create a Custom Menu Item in GoHighLevel

1. In GoHighLevel, go to Settings > White Label > Custom Menu Items
2. Click "Add Menu Item"
3. Fill in the following details:
   - Menu Label: Patient Engagement Scoring
   - Icon: Choose an appropriate icon (e.g., chart or dashboard)
   - URL: `https://your-domain.com/ghl-dashboard?locationId={{location_id}}&token={{access_token}}`
   - Open in: New Tab
4. Click "Save"

## Step 5: Test the Integration

1. Log in to your GoHighLevel account
2. Click on the new "Patient Engagement Scoring" menu item
3. The dashboard should load with your patient engagement data

## Troubleshooting

If you encounter issues with the integration, check the following:

1. Verify that your environment variables are correctly set
2. Ensure that your GoHighLevel app has the necessary permissions
3. Check that the custom fields are properly created
4. Verify that your server is accessible from GoHighLevel

## Data Flow

Here's how data flows through the system:

1. Patient fills out the chiropractic lead scoring form
2. Form data is processed and a lead score is calculated
3. Data is sent to GoHighLevel via webhook
4. When viewing the dashboard, data is retrieved from GoHighLevel via API
5. Dashboard visualizes the data with interactive charts

## Security Considerations

- All API requests use OAuth 2.0 for authentication
- Data is transmitted over HTTPS
- Access tokens are short-lived and refreshed automatically
- User permissions in GoHighLevel determine access to the dashboard

## Support

If you need assistance with this integration, please contact our support team at support@example.com.

---

© 2023 Chiropractic Lead Scoring System. All rights reserved. 