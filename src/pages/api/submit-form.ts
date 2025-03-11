import type { NextApiRequest, NextApiResponse } from 'next';
import { calculateLeadScore } from '../../utils/leadScoring';
import { sendToGoHighLevel } from '../../integrations/goHighLevel';

type FormData = {
  name: string;
  email: string;
  phone: string;
  painLevel: number;
  satisfactionLevel: number;
  improvementRate: number;
  likelihoodToReturn: number;
  referralPotential: number;
  additionalServices: string[];
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
    const formData = req.body as FormData;
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Calculate lead score
    const leadScore = calculateLeadScore({
      painLevel: formData.painLevel,
      satisfactionLevel: formData.satisfactionLevel,
      improvementRate: formData.improvementRate,
      likelihoodToReturn: formData.likelihoodToReturn,
      referralPotential: formData.referralPotential,
      additionalServices: formData.additionalServices
    });
    
    // Prepare data for GoHighLevel
    const ghlData = {
      ...formData,
      leadScore,
      formSubmissionDate: new Date().toISOString()
    };
    
    // Send to GoHighLevel
    const ghlResponse = await sendToGoHighLevel(ghlData);
    
    if (!ghlResponse.success) {
      console.error('Error sending to GoHighLevel:', ghlResponse.error);
      return res.status(500).json({ 
        error: 'Failed to send data to CRM',
        details: ghlResponse.error
      });
    }
    
    // Return success response with lead score
    return res.status(200).json({
      success: true,
      leadScore,
      message: 'Form submitted successfully'
    });
    
  } catch (error) {
    console.error('Form processing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process form submission'
    });
  }
} 