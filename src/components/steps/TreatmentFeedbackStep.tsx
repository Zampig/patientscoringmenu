import React from 'react';

interface TreatmentFeedbackStepProps {
  formData: {
    painLevel: number;
    satisfactionLevel: number;
    improvementRate: number;
  };
  updateFormData: (data: Partial<{
    painLevel: number;
    satisfactionLevel: number;
    improvementRate: number;
  }>) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

export const TreatmentFeedbackStep: React.FC<TreatmentFeedbackStepProps> = ({
  formData,
  updateFormData,
  goToNextStep,
  goToPreviousStep,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  const renderPainLevelDescription = (level: number) => {
    switch (level) {
      case 0: return 'No pain';
      case 1: case 2: return 'Mild pain';
      case 3: case 4: return 'Moderate pain';
      case 5: case 6: return 'Uncomfortable pain';
      case 7: case 8: return 'Severe pain';
      case 9: case 10: return 'Worst pain possible';
      default: return '';
    }
  };

  const renderSatisfactionDescription = (level: number) => {
    switch (level) {
      case 0: case 1: case 2: return 'Very dissatisfied';
      case 3: case 4: return 'Somewhat dissatisfied';
      case 5: case 6: return 'Neutral';
      case 7: case 8: return 'Satisfied';
      case 9: case 10: return 'Very satisfied';
      default: return '';
    }
  };

  const renderImprovementDescription = (level: number) => {
    switch (level) {
      case 0: case 1: return 'No improvement';
      case 2: case 3: return 'Slight improvement';
      case 4: case 5: case 6: return 'Moderate improvement';
      case 7: case 8: return 'Significant improvement';
      case 9: case 10: return 'Complete improvement';
      default: return '';
    }
  };

  return (
    <div className="form-step">
      <h2 className="form-title">Treatment Feedback</h2>
      <p className="form-subtitle">
        Please rate your experience with your chiropractic treatment.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="painLevel" className="form-label">
            Current Pain Level (0-10)
          </label>
          <div className="mb-2 text-sm text-gray-600">
            How would you rate your current pain level? 0 means no pain, 10 means worst pain possible.
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm font-medium">0</span>
            <input
              type="range"
              id="painLevel"
              min="0"
              max="10"
              step="1"
              className="form-slider flex-grow"
              value={formData.painLevel}
              onChange={(e) => updateFormData({ painLevel: parseInt(e.target.value) })}
            />
            <span className="ml-4 text-sm font-medium">10</span>
          </div>
          <div className="mt-1 text-center text-sm font-medium text-primary-700">
            {renderPainLevelDescription(formData.painLevel)}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="satisfactionLevel" className="form-label">
            Treatment Satisfaction (0-10)
          </label>
          <div className="mb-2 text-sm text-gray-600">
            How satisfied are you with your chiropractic treatment? 0 means very dissatisfied, 10 means very satisfied.
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm font-medium">0</span>
            <input
              type="range"
              id="satisfactionLevel"
              min="0"
              max="10"
              step="1"
              className="form-slider flex-grow"
              value={formData.satisfactionLevel}
              onChange={(e) => updateFormData({ satisfactionLevel: parseInt(e.target.value) })}
            />
            <span className="ml-4 text-sm font-medium">10</span>
          </div>
          <div className="mt-1 text-center text-sm font-medium text-primary-700">
            {renderSatisfactionDescription(formData.satisfactionLevel)}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="improvementRate" className="form-label">
            Improvement Rate (0-10)
          </label>
          <div className="mb-2 text-sm text-gray-600">
            How much improvement have you experienced since starting treatment? 0 means no improvement, 10 means complete improvement.
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm font-medium">0</span>
            <input
              type="range"
              id="improvementRate"
              min="0"
              max="10"
              step="1"
              className="form-slider flex-grow"
              value={formData.improvementRate}
              onChange={(e) => updateFormData({ improvementRate: parseInt(e.target.value) })}
            />
            <span className="ml-4 text-sm font-medium">10</span>
          </div>
          <div className="mt-1 text-center text-sm font-medium text-primary-700">
            {renderImprovementDescription(formData.improvementRate)}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="form-button-secondary"
            onClick={goToPreviousStep}
          >
            Previous
          </button>
          <button type="submit" className="form-button-primary">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}; 