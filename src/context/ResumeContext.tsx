"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import type { ResumeData, PersonalInfo, WorkExperience, Education, Skill, Summary } from "../types/resume"

interface ResumeContextType {
  resumeData: ResumeData
  updatePersonalInfo: (info: PersonalInfo) => void
  updateWorkExperience: (experience: WorkExperience[]) => void
  updateEducation: (education: Education[]) => void
  updateSkills: (skills: Skill[]) => void
  updateSummary: (summary: Summary) => void
  currentStep: number
  setCurrentStep: (step: number) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  isEditing: boolean
  editingResumeId?: string
}

const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  },
  workExperience: [],
  education: [],
  skills: [],
  summary: {
    content: "",
  },
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined)

export const useResume = () => {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider")
  }
  return context
}

interface ResumeProviderProps {
  children: ReactNode
  initialData?: ResumeData
  editingResumeId?: string
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children, initialData, editingResumeId }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData || initialResumeData)
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!editingResumeId

  // Update resume data when initialData changes (for editing existing resumes)
  useEffect(() => {
    if (initialData) {
      setResumeData({
        ...initialData,
        summary: initialData.summary || { content: "" },
      })
    } else {
      setResumeData(initialResumeData)
    }
  }, [initialData])

  const updatePersonalInfo = (info: PersonalInfo) => {
    setResumeData((prev) => ({ ...prev, personalInfo: info }))
  }

  const updateWorkExperience = (experience: WorkExperience[]) => {
    setResumeData((prev) => ({ ...prev, workExperience: experience }))
  }

  const updateEducation = (education: Education[]) => {
    setResumeData((prev) => ({ ...prev, education: education }))
  }

  const updateSkills = (skills: Skill[]) => {
    setResumeData((prev) => ({ ...prev, skills: skills }))
  }

  const updateSummary = (summary: Summary) => {
    setResumeData((prev) => ({ ...prev, summary: summary }))
  }

  // Add isEditing and editingResumeId to the context value
  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updatePersonalInfo,
        updateWorkExperience,
        updateEducation,
        updateSkills,
        updateSummary,
        currentStep,
        setCurrentStep,
        isLoading,
        setIsLoading,
        isEditing,
        editingResumeId,
      }}
    >
      {children}
    </ResumeContext.Provider>
  )
}
