# GoHighLevel Integration Guide

This guide provides step-by-step instructions for integrating the Patient Engagement Dashboard with GoHighLevel.

## Prerequisites

Before you begin, make sure you have:

1. A GoHighLevel account with admin access
2. The Patient Engagement Dashboard deployed to a hosting service (e.g., Vercel, Netlify)
3. Custom fields set up in GoHighLevel for tracking engagement scores

## Step 1: Create Custom Fields in GoHighLevel

First, you need to create custom fields in GoHighLevel to store patient engagement scores:

1. Log in to your GoHighLevel account
2. Go to Settings > Custom Fields
3. Click "Add New Field"
4. Create the following fields:

   | Field Name | Field Type | Description |
   |------------|------------|-------------|
   | current_engagement_score | Number | The patient's most recent engagement score (0-50) |
   | average_engagement_score | Number | The average of the patient's last 5 engagement scores |
   | preferred_communication_method | Text | The patient's preferred method of communication |

5. Click "Save" for each field

## Step 2: Create a Custom App in GoHighLevel

To integrate your dashboard, you need to create a custom app in GoHighLevel:

1. Go to the [GoHighLevel Developer Portal](https://marketplace.gohighlevel.com/developer/)
2. Click "Create New App"
3. Fill in the app details:
   - **App Name**: Patient Engagement Dashboard
   - **Description**: Dashboard for visualizing patient engagement scores
   - **App Logo**: Upload your logo (optional)
   - **Redirect URL**: `https://your-deployed-app.com/api/ghl-callback`
   - **Webhook URL**: `https://your-deployed-app.com/api/ghl-webhook` (optional)
4. Select the following permissions:
   - `contacts.readonly` - To read contact information
   - `locations.readonly` - To access location information
   - `custom_fields.readonly` - To read custom field values
5. Click "Create App"
6. Note your Client ID and Client Secret for the next step

## Step 3: Configure Environment Variables

Set the following environment variables in your deployed application:

```
GHL_CLIENT_ID=your_client_id_from_step_2
GHL_CLIENT_SECRET=your_client_secret_from_step_2
GHL_REDIRECT_URI=https://your-deployed-app.com/api/ghl-callback
```

## Step 4: Add a Custom Menu Item in GoHighLevel

To make your dashboard accessible from within GoHighLevel:

1. Go to Settings > Custom Menu Items
2. Click "Add New Menu Item"
3. Fill in the details:
   - **Name**: Patient Engagement Dashboard
   - **URL**: `https://your-deployed-app.com/embed?locationId={locationId}&accessToken={accessToken}`
   - **Icon**: Choose an appropriate icon
4. Click "Save"

## Step 5: Set Up a Workflow for Updating Engagement Scores

To automatically update engagement scores when a form is submitted:

1. Go to Workflows > Create New Workflow
2. Name your workflow "Update Patient Engagement Score"
3. Set the trigger to "Form Submission"
4. Select your patient feedback form
5. Add an action to "Update Contact"
6. Map the form fields to the custom fields:
   - Map the calculated engagement score to `current_engagement_score`
   - Set up a calculation for `average_engagement_score` based on previous scores
7. Save and activate the workflow

## Step 6: Test the Integration

To verify that everything is working correctly:

1. Log in to GoHighLevel
2. Click on your custom menu item "Patient Engagement Dashboard"
3. Verify that the dashboard loads and displays patient data
4. Submit a test form and check that the engagement scores are updated
5. Refresh the dashboard to see the updated scores

## Troubleshooting

### Dashboard Shows No Data

- Check that your custom fields are correctly named in GoHighLevel
- Verify that you have patients with engagement scores in your account
- Check the browser console for any error messages
- Verify that your environment variables are correctly set

### Authentication Errors

- Make sure your Client ID and Client Secret are correct
- Check that your Redirect URI matches exactly what you set in the Developer Portal
- Verify that you've selected the correct permissions for your app

### Custom Fields Not Updating

- Check your workflow configuration
- Verify that the form fields are correctly mapped to custom fields
- Test the workflow with a sample form submission

## Advanced Configuration

### Customizing Score Ranges

You can customize the score ranges displayed in the dashboard by modifying the `groupContactsByScoreRange` function in `utils/ghlApi.js`:

```javascript
const ranges = [
  { min: 0, max: 10, label: '0-10' },
  { min: 11, max: 20, label: '11-20' },
  { min: 21, max: 30, label: '21-30' },
  { min: 31, max: 40, label: '31-40' },
  { min: 41, max: 50, label: '41-50' },
];
```

### Adding Additional Filters

To add more filtering options, modify the `FilterPanel.js` component and update the `filterContacts` function in `utils/ghlApi.js`.

## Support

If you encounter any issues with the integration, please contact our support team at support@example.com or open an issue on our GitHub repository.

---

© 2023 Chiropractic Lead Scoring System. All rights reserved. 