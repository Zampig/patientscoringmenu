import axios from 'axios';

interface GHLData {
  name: string;
  email: string;
  phone: string;
  leadScore: number;
  painLevel: number;
  satisfactionLevel: number;
  improvementRate: number;
  likelihoodToReturn: number;
  referralPotential: number;
  additionalServices: string[];
  formSubmissionDate: string;
}

export async function sendToGoHighLevel(data: GHLData) {
  // GoHighLevel webhook URL from environment variable
  const webhookUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_URL;
  
  if (!webhookUrl) {
    throw new Error('GoHighLevel webhook URL not configured');
  }
  
  // Format data for GoHighLevel
  const formData = new URLSearchParams();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('phone', data.phone);
  formData.append('leadScore', data.leadScore.toString());
  formData.append('painLevel', data.painLevel.toString());
  formData.append('satisfactionLevel', data.satisfactionLevel.toString());
  formData.append('improvementRate', data.improvementRate.toString());
  formData.append('likelihoodToReturn', data.likelihoodToReturn.toString());
  formData.append('referralPotential', data.referralPotential.toString());
  formData.append('additionalServices', JSON.stringify(data.additionalServices));
  formData.append('formSubmissionDate', data.formSubmissionDate);
  
  try {
    // Send to GoHighLevel
    const response = await axios.post(webhookUrl, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error sending data to GoHighLevel:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Helper function to determine which GHL pipeline to add the contact to based on score
export function determineGHLPipeline(score: number): string {
  if (score >= 80) return 'High Retention';
  if (score >= 50) return 'Nurture';
  return 'At Risk';
}

// Helper function to determine which GHL tags to add based on score
export function determineGHLTags(score: number): string[] {
  const tags: string[] = [];
  
  if (score >= 80) {
    tags.push('Likely to refer');
    tags.push('High value patient');
  } else if (score >= 50) {
    tags.push('Needs nurturing');
    tags.push('Follow-up required');
  } else {
    tags.push('At risk');
    tags.push('Immediate attention');
  }
  
  return tags;
} 