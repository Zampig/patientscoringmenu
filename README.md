# Chiropractic Lead Scoring System

A custom chiropractic patient form that calculates lead scores (0-100) and integrates with GoHighLevel CRM.

## Features

- Multi-step form with smooth transitions
- Patient information collection
- Treatment feedback assessment
- Future interest evaluation
- Lead scoring algorithm (0-100)
- GoHighLevel CRM integration
- Mobile-responsive design
- HIPAA-compliant data handling

## Lead Scoring Algorithm

The system uses a weighted scoring algorithm that processes form responses to generate a 0-100 retention score:

- Pain Level (15%): Lower current pain levels indicate better treatment outcomes
- Satisfaction Level (25%): Higher satisfaction indicates better patient experience
- Improvement Rate (20%): Higher improvement rates indicate effective treatment
- Likelihood to Return (25%): Higher likelihood indicates better retention potential
- Referral Potential (10%): Higher referral potential indicates patient advocacy
- Additional Services Interest (5%): More interest in additional services indicates engagement

## GoHighLevel Integration

The system integrates with GoHighLevel CRM through webhooks:

- High Score (80-100): Added to "High Retention" pipeline and tagged as "Likely to refer"
- Medium Score (50-79): Added to "Nurture" campaign with automated follow-ups
- Low Score (0-49): Added to "At Risk" pipeline with immediate staff notification

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/chiro-lead-scoring.git
   cd chiro-lead-scoring
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_GHL_WEBHOOK_URL=your_gohighlevel_webhook_url
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the form.

## Deployment

The application can be deployed to Vercel with the following steps:

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

## Security Considerations

- All communications use HTTPS
- Proper CORS settings prevent unauthorized access
- Rate limiting prevents abuse
- PHI is not stored in logs or analytics
- Form data is cleared from local storage after submission
- Sessions timeout after inactivity
- Privacy policy and consent mechanisms are implemented

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- GoHighLevel for CRM integration capabilities
- Next.js team for the React framework
- TailwindCSS for the styling framework 