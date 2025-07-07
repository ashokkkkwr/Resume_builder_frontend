import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  stepIcons?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  currentStep, 
  totalSteps, 
  stepLabels,
  stepIcons = []
}) => {
  return (
    <div className="w-full">
      {/* Mobile Progress Bar */}
      <div className="block sm:hidden mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="mt-3 text-center">
          <span className="text-lg">{stepIcons[currentStep]}</span>
          <h3 className="text-lg font-semibold text-gray-900">{stepLabels[currentStep]}</h3>
        </div>
      </div>

      {/* Desktop Step Indicator */}
      <div className="hidden sm:flex items-center justify-between">
        {stepLabels.map((label, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center space-y-2">
              <div className={`
                relative flex items-center justify-center w-12 h-12 rounded-full text-sm font-medium transition-all duration-300
                ${index < currentStep 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25' 
                  : index === currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25 scale-110' 
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }
              `}>
                {index < currentStep ? (
                  <Check size={20} className="animate-in fade-in duration-300" />
                ) : (
                  <span className="text-lg">{stepIcons[index] || index + 1}</span>
                )}
                
                {index === currentStep && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
                )}
              </div>
              
              <div className="text-center">
                <span className={`
                  text-xs font-medium transition-colors duration-300
                  ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
                `}>
                  {label}
                </span>
              </div>
            </div>
            
            {index < totalSteps - 1 && (
              <div className="flex-1 mx-4">
                <div className={`
                  h-0.5 transition-all duration-500 ease-out
                  ${index < currentStep 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                    : 'bg-gray-200'
                  }
                `} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};