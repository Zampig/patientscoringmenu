interface FormData {
  painLevel: number;
  satisfactionLevel: number;
  improvementRate: number;
  likelihoodToReturn: number;
  referralPotential: number;
  additionalServices: string[];
}

export function calculateLeadScore(formData: FormData): number {
  // Weights for different factors (total = 100)
  const weights = {
    painLevel: 15,
    satisfactionLevel: 25,
    improvementRate: 20,
    likelihoodToReturn: 25,
    referralPotential: 10,
    additionalServicesInterest: 5
  };
  
  // Normalize all values to 0-1 scale
  const normalizedPainLevel = 1 - (formData.painLevel / 10); // Lower pain is better
  const normalizedSatisfaction = formData.satisfactionLevel / 10;
  const normalizedImprovement = formData.improvementRate / 10;
  const normalizedLikelihood = formData.likelihoodToReturn / 10;
  const normalizedReferral = formData.referralPotential / 10;
  const normalizedServices = Math.min(formData.additionalServices.length / 3, 1);
  
  // Calculate weighted score
  const score = 
    (normalizedPainLevel * weights.painLevel) +
    (normalizedSatisfaction * weights.satisfactionLevel) +
    (normalizedImprovement * weights.improvementRate) +
    (normalizedLikelihood * weights.likelihoodToReturn) +
    (normalizedReferral * weights.referralPotential) +
    (normalizedServices * weights.additionalServicesInterest);
  
  // Round to nearest integer
  return Math.round(score);
}

export function getScoreCategory(score: number): 'high' | 'medium' | 'low' {
  if (score >= 80) return 'high';
  if (score >= 50) return 'medium';
  return 'low';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreDescription(score: number): string {
  if (score >= 80) {
    return 'High retention potential. This patient is likely to continue treatment and refer others.';
  } else if (score >= 50) {
    return 'Moderate retention potential. This patient may need additional follow-up to ensure continued engagement.';
  } else {
    return 'Low retention potential. This patient is at risk of discontinuing treatment and requires immediate attention.';
  }
} 