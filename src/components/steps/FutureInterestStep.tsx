import React from 'react';

interface FutureInterestStepProps {
  formData: {
    likelihoodToReturn: number;
    referralPotential: number;
    additionalServices: string[];
  };
  updateFormData: (data: Partial<{
    likelihoodToReturn: number;
    referralPotential: number;
    additionalServices: string[];
  }>) => void;
  goToPreviousStep: () => void;
  submitForm: () => void;
}

export const FutureInterestStep: React.FC<FutureInterestStepProps> = ({
  formData,
  updateFormData,
  goToPreviousStep,
  submitForm,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await submitForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (service: string) => {
    const currentServices = [...formData.additionalServices];
    const serviceIndex = currentServices.indexOf(service);
    
    if (serviceIndex === -1) {
      // Add service if not already selected
      updateFormData({ additionalServices: [...currentServices, service] });
    } else {
      // Remove service if already selected
      currentServices.splice(serviceIndex, 1);
      updateFormData({ additionalServices: currentServices });
    }
  };

  const renderLikelihoodDescription = (level: number) => {
    switch (level) {
      case 0: case 1: case 2: return 'Very unlikely';
      case 3: case 4: return 'Somewhat unlikely';
      case 5: case 6: return 'Neutral';
      case 7: case 8: return 'Likely';
      case 9: case 10: return 'Very likely';
      default: return '';
    }
  };

  const additionalServicesOptions = [
    'Massage Therapy',
    'Acupuncture',
    'Physical Therapy',
    'Nutritional Counseling',
    'Wellness Workshops',
    'Ergonomic Assessment'
  ];

  return (
    <div className="form-step">
      <h2 className="form-title">Future Treatment Interest</h2>
      <p className="form-subtitle">
        Please tell us about your interest in future treatments and services.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="likelihoodToReturn" className="form-label">
            Likelihood to Continue Treatment (0-10)
          </label>
          <div className="mb-2 text-sm text-gray-600">
            How likely are you to continue with your chiropractic treatment plan? 0 means very unlikely, 10 means very likely.
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm font-medium">0</span>
            <input
              type="range"
              id="likelihoodToReturn"
              min="0"
              max="10"
              step="1"
              className="form-slider flex-grow"
              value={formData.likelihoodToReturn}
              onChange={(e) => updateFormData({ likelihoodToReturn: parseInt(e.target.value) })}
            />
            <span className="ml-4 text-sm font-medium">10</span>
          </div>
          <div className="mt-1 text-center text-sm font-medium text-primary-700">
            {renderLikelihoodDescription(formData.likelihoodToReturn)}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="referralPotential" className="form-label">
            Likelihood to Refer Others (0-10)
          </label>
          <div className="mb-2 text-sm text-gray-600">
            How likely are you to refer friends or family to our practice? 0 means very unlikely, 10 means very likely.
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-sm font-medium">0</span>
            <input
              type="range"
              id="referralPotential"
              min="0"
              max="10"
              step="1"
              className="form-slider flex-grow"
              value={formData.referralPotential}
              onChange={(e) => updateFormData({ referralPotential: parseInt(e.target.value) })}
            />
            <span className="ml-4 text-sm font-medium">10</span>
          </div>
          <div className="mt-1 text-center text-sm font-medium text-primary-700">
            {renderLikelihoodDescription(formData.referralPotential)}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Interest in Additional Services
          </label>
          <div className="mb-2 text-sm text-gray-600">
            Which additional services would you be interested in learning more about? Select all that apply.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {additionalServicesOptions.map((service) => (
              <div key={service} className="flex items-center">
                <input
                  type="checkbox"
                  id={`service-${service}`}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.additionalServices.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                />
                <label
                  htmlFor={`service-${service}`}
                  className="ml-2 block text-sm text-gray-700"
                >
                  {service}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="form-button-secondary"
            onClick={goToPreviousStep}
            disabled={isSubmitting}
          >
            Previous
          </button>
          <button
            type="submit"
            className="form-button-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
}; 