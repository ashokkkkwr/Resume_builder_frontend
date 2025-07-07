"use client"

import type React from "react"
import { useResume } from "../context/ResumeContext"
import { Button } from "./ui/Button"
import { StepIndicator } from "./StepIndicator"
import { PersonalInfoStep } from "./FormSteps/PersonalInfoStep"
import { WorkExperienceStep } from "./FormSteps/WorkExperienceStep"
import { EducationStep } from "./FormSteps/EducationStep"
import { SkillsStep } from "./FormSteps/SkillsStep"
import { SummaryStep } from "./FormSteps/SummaryStep"
import { resumeService } from "../services/resumeService"
import { validatePersonalInfo } from "../utils/validation"
import { ChevronLeft, ChevronRight, Save, Download, CheckCircle, Loader2 } from "lucide-react"

const steps = [
  { component: PersonalInfoStep, label: "Personal", icon: "👤" },
  { component: WorkExperienceStep, label: "Experience", icon: "💼" },
  { component: EducationStep, label: "Education", icon: "🎓" },
  { component: SkillsStep, label: "Skills", icon: "⚡" },
  { component: SummaryStep, label: "Summary", icon: "📝" },
]

export const FormContainer: React.FC = () => {
  const { currentStep, setCurrentStep, resumeData, isLoading, setIsLoading, isEditing, editingResumeId } = useResume()

  const CurrentStepComponent = steps[currentStep].component

  const handleNext = () => {
    if (currentStep === 0) {
      const errors = validatePersonalInfo(resumeData.personalInfo)
      if (Object.keys(errors).length > 0) {
        alert("Please fill in all required fields in the Personal Information section.")
        return
      }
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      const result = await resumeService.saveDraft(resumeData)
      alert(`Draft saved successfully! Resume ID: ${result.id}`)
    } catch (error) {
      alert("Failed to save draft. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveCompleted = async () => {
    const personalErrors = validatePersonalInfo(resumeData.personalInfo)
    if (Object.keys(personalErrors).length > 0) {
      alert("Please complete the Personal Information section before saving.")
      setCurrentStep(0)
      return
    }

    if (resumeData.workExperience.length === 0) {
      alert("Please add at least one work experience before saving.")
      setCurrentStep(1)
      return
    }

    if (!resumeData.summary || !resumeData.summary.content || !resumeData.summary.content.trim()) {
      alert("Please add a professional summary before saving.")
      setCurrentStep(4)
      return
    }

    setIsLoading(true)
    try {
      const result = await resumeService.saveResume(resumeData)
      alert(`Resume saved successfully! Resume ID: ${result.id}`)
    } catch (error) {
      alert("Failed to save resume. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateResume = async () => {
    if (!editingResumeId) return

    const personalErrors = validatePersonalInfo(resumeData.personalInfo)
    if (Object.keys(personalErrors).length > 0) {
      alert("Please complete the Personal Information section before updating.")
      setCurrentStep(0)
      return
    }

    if (resumeData.workExperience.length === 0) {
      alert("Please add at least one work experience before updating.")
      setCurrentStep(1)
      return
    }

    if (!resumeData.summary || !resumeData.summary.content || !resumeData.summary.content.trim()) {
      alert("Please add a professional summary before updating.")
      setCurrentStep(4)
      return
    }

    setIsLoading(true)
    try {
      const result = await resumeService.updateResume(editingResumeId, resumeData, "completed")
      alert(`Resume updated successfully! Resume ID: ${result.id}`)
    } catch (error) {
      alert("Failed to update resume. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateDraft = async () => {
    if (!editingResumeId) return

    setIsLoading(true)
    try {
      const result = await resumeService.updateResume(editingResumeId, resumeData, "draft")
      alert(`Draft updated successfully! Resume ID: ${result.id}`)
    } catch (error) {
      alert("Failed to update draft. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  return (
    <div className="space-y-8">
      {/* Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          stepLabels={steps.map((step) => step.label)}
          stepIcons={steps.map((step) => step.icon)}
        />
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{steps[currentStep].icon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{steps[currentStep].label}</h2>
                <p className="text-slate-600">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <div className="w-20 h-1 bg-slate-900 rounded-full"></div>
          </div>

          <div className="mb-8">
            <CurrentStepComponent />
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={isFirstStep}
              className="w-full sm:w-auto order-2 sm:order-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </Button>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
              <Button
                variant="outline"
                onClick={isEditing ? handleUpdateDraft : handleSaveDraft}
                disabled={isLoading}
                className="w-full sm:w-auto border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{isLoading ? "Saving..." : isEditing ? "Update Draft" : "Save Draft"}</span>
              </Button>

              <Button
                onClick={isEditing ? handleUpdateResume : handleSaveCompleted}
                disabled={isLoading}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                <span>{isLoading ? "Saving..." : isEditing ? "Update Resume" : "Save Resume"}</span>
              </Button>

              {!isLastStep ? (
                <Button
                  onClick={handleNext}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span>Continue</span>
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  onClick={isEditing ? handleUpdateDraft : handleSaveDraft}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  <span>{isLoading ? "Saving..." : isEditing ? "Update & Finish" : "Finish & Save"}</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
