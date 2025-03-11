import React, { useState } from 'react';
import { PatientInfoStep } from './steps/PatientInfoStep';
import { TreatmentFeedbackStep } from './steps/TreatmentFeedbackStep';
import { FutureInterestStep } from './steps/FutureInterestStep';
import { ProgressIndicator } from './ProgressIndicator';
import { calculateLeadScore } from '../utils/leadScoring';

export const ChiropracticForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Patient info
    name: '',
    email: '',
    phone: '',
    
    // Treatment feedback
    painLevel: 5,
    satisfactionLevel: 5,
    improvementRate: 5,
    
    // Future interest
    likelihoodToReturn: 5,
    referralPotential: 5,
    additionalServices: [] as string[]
  });
  
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    leadScore?: number;
    message: string;
  } | null>(null);
  
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...data
    }));
  };
  
  const handleSubmit = async () => {
    try {
      // Calculate lead score
      const leadScore = calculateLeadScore({
        painLevel: formData.painLevel,
        satisfactionLevel: formData.satisfactionLevel,
        improvementRate: formData.improvementRate,
        likelihoodToReturn: formData.likelihoodToReturn,
        referralPotential: formData.referralPotential,
        additionalServices: formData.additionalServices
      });
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        leadScore,
        formSubmissionDate: new Date().toISOString()
      };
      
      // Submit to API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmissionResult({
          success: true,
          leadScore,
          message: 'Thank you for your feedback! Your information has been submitted successfully.'
        });
      } else {
        setSubmissionResult({
          success: false,
          message: result.error || 'There was an error submitting your feedback. Please try again.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmissionResult({
        success: false,
        message: 'There was an error submitting your feedback. Please try again.'
      });
    }
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      painLevel: 5,
      satisfactionLevel: 5,
      improvementRate: 5,
      likelihoodToReturn: 5,
      referralPotential: 5,
      additionalServices: []
    });
    setCurrentStep(0);
    setSubmissionResult(null);
  };
  
  const stepTitles = ['Patient Info', 'Treatment Feedback', 'Future Interest'];
  
  // If form has been submitted, show the result
  if (submissionResult) {
    return (
      <div className="form-container">
        <div className={`p-6 rounded-lg ${submissionResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${submissionResult.success ? 'text-green-700' : 'text-red-700'}`}>
            {submissionResult.success ? 'Submission Successful' : 'Submission Failed'}
          </h2>
          <p className="mb-4">{submissionResult.message}</p>
          
          {submissionResult.success && submissionResult.leadScore !== undefined && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Your Lead Score</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full ${
                      submissionResult.leadScore >= 80
                        ? 'bg-green-600'
                        : submissionResult.leadScore >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${submissionResult.leadScore}%` }}
                  ></div>
                </div>
                <span className="ml-4 font-bold">{submissionResult.leadScore}</span>
              </div>
            </div>
          )}
          
          <button
            onClick={resetForm}
            className="form-button-primary"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="form-container">
      <ProgressIndicator
        currentStep={currentStep}
        totalSteps={stepTitles.length}
        stepTitles={stepTitles}
      />
      
      {currentStep === 0 && (
        <PatientInfoStep
          formData={formData}
          updateFormData={updateFormData}
          goToNextStep={() => setCurrentStep(1)}
        />
      )}
      
      {currentStep === 1 && (
        <TreatmentFeedbackStep
          formData={formData}
          updateFormData={updateFormData}
          goToNextStep={() => setCurrentStep(2)}
          goToPreviousStep={() => setCurrentStep(0)}
        />
      )}
      
      {currentStep === 2 && (
        <FutureInterestStep
          formData={formData}
          updateFormData={updateFormData}
          goToPreviousStep={() => setCurrentStep(1)}
          submitForm={handleSubmit}
        />
      )}
    </div>
  );
}; 