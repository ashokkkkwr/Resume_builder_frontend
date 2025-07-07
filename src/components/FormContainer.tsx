import React from 'react';
import { useResume } from '../context/ResumeContext';
import { Button } from './ui/Button';
import { StepIndicator } from './StepIndicator';
import { PersonalInfoStep } from './FormSteps/PersonalInfoStep';
import { WorkExperienceStep } from './FormSteps/WorkExperienceStep';
import { EducationStep } from './FormSteps/EducationStep';
import { SkillsStep } from './FormSteps/SkillsStep';
import { SummaryStep } from './FormSteps/SummaryStep';
import { resumeService } from '../services/resumeService';
import { validatePersonalInfo } from '../utils/validation';
import { ChevronLeft, ChevronRight, Save, Download, CheckCircle } from 'lucide-react';

const steps = [
  { component: PersonalInfoStep, label: 'Personal', icon: '👤' },
  { component: WorkExperienceStep, label: 'Experience', icon: '💼' },
  { component: EducationStep, label: 'Education', icon: '🎓' },
  { component: SkillsStep, label: 'Skills', icon: '⚡' },
  { component: SummaryStep, label: 'Summary', icon: '📝' }
];

export const FormContainer: React.FC = () => {
  const { 
    currentStep, 
    setCurrentStep, 
    resumeData, 
    isLoading, 
    setIsLoading 
  } = useResume();

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep === 0) {
      const errors = validatePersonalInfo(resumeData.personalInfo);
      if (Object.keys(errors).length > 0) {
        alert('Please fill in all required fields in the Personal Information section.');
        return;
      }
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      const result = await resumeService.saveDraft(resumeData);
      alert(`Draft saved successfully! Resume ID: ${result.id}`);
    } catch (error) {
      alert('Failed to save draft. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCompleted = async () => {
    console.log('xiro');
    // Validate that all required sections are filled
    const personalErrors = validatePersonalInfo(resumeData.personalInfo);
    if (Object.keys(personalErrors).length > 0) {
      alert('Please complete the Personal Information section before saving.');
      setCurrentStep(0);
      return;
    }

    if (resumeData.workExperience.length === 0) {
      alert('Please add at least one work experience before saving.');
      setCurrentStep(1);
      return;
    }

    if (!resumeData.summary.content.trim()) {
      alert('Please add a professional summary before saving.');
      setCurrentStep(4);
      return;
    }

    setIsLoading(true);
    try {
      const result = await resumeService.saveResume(resumeData);
      alert(`Resume saved successfully! Resume ID: ${result.id}`);
    } catch (error) {
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  // Check if resume is complete enough to save as completed
  const isResumeComplete = () => {
    const personalErrors = validatePersonalInfo(resumeData.personalInfo);
    return Object.keys(personalErrors).length === 0 && 
           resumeData.workExperience.length > 0 && 
           resumeData.summary.content.trim().length > 0;
  };

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-6">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          stepLabels={steps.map(step => step.label)}
          stepIcons={steps.map(step => step.icon)}
        />
      </div>

      {/* Form Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{steps[currentStep].icon}</span>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {steps[currentStep].label}
              </h2>
            </div>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
          </div>

          <div className="mb-8">
            <CurrentStepComponent />
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50/50 backdrop-blur-sm border-t border-gray-200/50 px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </Button>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <Save size={16} />
                <span>{isLoading ? 'Saving...' : 'Save Draft'}</span>
              </Button>

              
                <Button
                  onClick={handleSaveCompleted}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <CheckCircle size={16} />
                  <span>{isLoading ? 'Saving...' : 'Save Resume'}</span>
                </Button>
              

              {!isLastStep ? (
                <Button
                  onClick={handleNext}
                  className="w-full sm:w-auto"
                >
                  <span>Continue</span>
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <Download size={16} />
                  <span>{isLoading ? 'Saving...' : 'Finish & Save'}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};