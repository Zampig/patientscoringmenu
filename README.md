# Patient Engagement Dashboard

A dashboard for visualizing patient engagement scores from GoHighLevel. This application allows chiropractic practices to monitor and analyze patient engagement metrics to improve patient retention and satisfaction.

## Features

- **Summary Section**: Displays key metrics like Average Engagement Score and Current Engagement Score
- **Visual Charts**: 
  - Pie chart showing distribution of patients by engagement score ranges
  - Bar chart displaying patients by engagement categories
- **Filtering Capabilities**: Filter patients by score range, communication method, and search terms
- **Date Range Selection**: View data for specific time periods
- **Patient List**: Sortable list of patients with engagement scores
- **Data Export**: Export patient data to Excel/CSV

## Tech Stack

- Next.js
- React
- Chart.js
- TailwindCSS
- GoHighLevel API Integration

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- GoHighLevel account with API access

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/patient-engagement-dashboard.git
   cd patient-engagement-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   GHL_CLIENT_ID=your_gohighlevel_client_id
   GHL_CLIENT_SECRET=your_gohighlevel_client_secret
   GHL_REDIRECT_URI=your_redirect_uri
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## GoHighLevel Integration

### Required Custom Fields

For this dashboard to work properly, you need to create the following custom fields in GoHighLevel:

1. **current_engagement_score**: Numeric field (0-50) representing the patient's current engagement score
2. **average_engagement_score**: Numeric field (0-50) representing the patient's average engagement score over time
3. **preferred_communication_method**: Text field with values like "email", "phone", or "text"

### Embedding in GoHighLevel

To embed this dashboard in GoHighLevel:

1. Deploy this application to a hosting service like Vercel or Netlify
2. Create a custom app in GoHighLevel Developer Portal
3. Add a custom menu item in GoHighLevel that links to your deployed application with the following URL format:
   ```
   https://your-deployed-app.com/embed?locationId={locationId}&accessToken={accessToken}
   ```

## Development

### Mock Data

During development, the application uses mock data if GoHighLevel credentials are not provided. This allows you to develop and test the UI without connecting to the actual API.

### API Endpoints

- **/api/patients**: Fetches patient data from GoHighLevel

## Deployment

### Vercel

The easiest way to deploy this application is with Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Other Hosting Options

You can also deploy to other hosting services like Netlify, AWS, or DigitalOcean by following their respective deployment guides for Next.js applications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GoHighLevel for their API
- Next.js team for the React framework
- TailwindCSS for the styling framework
- Chart.js for the visualization library
