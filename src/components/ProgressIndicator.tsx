import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
}) => {
  return (
    <div className="progress-indicator">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="progress-step">
            <div
              className={`progress-circle ${
                index < currentStep
                  ? 'progress-circle-completed'
                  : index === currentStep
                  ? 'progress-circle-active'
                  : 'progress-circle-inactive'
              }`}
            >
              {index < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="text-xs mt-1 text-center">{stepTitles[index]}</div>
          </div>
          
          {index < totalSteps - 1 && (
            <div
              className={`progress-line ${
                index < currentStep ? 'progress-line-active' : 'progress-line-inactive'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}; 