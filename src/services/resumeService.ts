import type { ResumeData } from "../types/resume"
import { env } from "../config/env"
import { v4 as uuidv4 } from "uuid"

export interface SavedResume {
  id: string
  title: string
  status: "draft" | "completed"
  userId?: string | null
  createdAt: string
  updatedAt: string
  personalInfo: {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone: string
    location: string
    website?: string
    linkedin?: string
    github?: string
    createdAt?: string
    updatedAt?: string
  }
  workExperience: any[]
  education: any[]
  skills: any[]
  summary: any
}

export interface ResumeListResponse {
  resumes: SavedResume[]
  total: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

const API_BASE_URL = env.API_BASE_URL

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), env.API_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

export const resumeService = {
  async saveDraft(resumeData: ResumeData, title?: string): Promise<SavedResume> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes/draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`,
          data: resumeData,
          status: "draft",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save draft")
      }

      const apiResponse: ApiResponse<SavedResume> = await response.json()
      return apiResponse.data
    } catch (error) {
      const draft: SavedResume = {
        id: uuidv4(),
        title: title || `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        personalInfo: resumeData.personalInfo,
        workExperience: resumeData.workExperience,
        education: resumeData.education,
        skills: resumeData.skills,
        summary: resumeData.summary,
      }
      const existingDrafts = JSON.parse(localStorage.getItem("resume_drafts") || "[]")
      existingDrafts.push(draft)
      localStorage.setItem("resume_drafts", JSON.stringify(existingDrafts))
      return draft
    }
  },
  async saveResume(resumeData: ResumeData, title?: string): Promise<SavedResume> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`,
          data: resumeData,
          status: "completed",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save resume")
      }

      const apiResponse: ApiResponse<SavedResume> = await response.json()
      return apiResponse.data
    } catch (error) {
      const savedResume: SavedResume = {
        id: uuidv4(),
        title: title || `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`,
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        personalInfo: resumeData.personalInfo,
        workExperience: resumeData.workExperience,
        education: resumeData.education,
        skills: resumeData.skills,
        summary: resumeData.summary,
      }
      const existingResumes = JSON.parse(localStorage.getItem("saved_resumes") || "[]")
      existingResumes.push(savedResume)
      localStorage.setItem("saved_resumes", JSON.stringify(existingResumes))
      return savedResume
    }
  },
  async updateResume(id: string, resumeData: ResumeData, status: "draft" | "completed"): Promise<SavedResume> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: resumeData,
          status,
          updatedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update resume")
      }

      const apiResponse: ApiResponse<SavedResume> = await response.json()
      return apiResponse.data
    } catch (error) {
      const drafts = JSON.parse(localStorage.getItem("resume_drafts") || "[]")
      const completed = JSON.parse(localStorage.getItem("saved_resumes") || "[]")
      let foundInDrafts = false
      let foundInCompleted = false
      let updatedResume: SavedResume | null = null

      const draftIndex = drafts.findIndex((r: SavedResume) => r.id === id)
      const completedIndex = completed.findIndex((r: SavedResume) => r.id === id)

      if (draftIndex !== -1) {
        foundInDrafts = true
        updatedResume = {
          ...drafts[draftIndex],
          personalInfo: resumeData.personalInfo,
          workExperience: resumeData.workExperience,
          education: resumeData.education,
          skills: resumeData.skills,
          summary: resumeData.summary,
          status,
          updatedAt: new Date().toISOString(),
        }

        if (status === "completed") {
          drafts.splice(draftIndex, 1)
          completed.push(updatedResume)
        } else {
          drafts[draftIndex] = updatedResume
        }
      } else if (completedIndex !== -1) {
        foundInCompleted = true
        updatedResume = {
          ...completed[completedIndex],
          personalInfo: resumeData.personalInfo,
          workExperience: resumeData.workExperience,
          education: resumeData.education,
          skills: resumeData.skills,
          summary: resumeData.summary,
          status,
          updatedAt: new Date().toISOString(),
        }

        if (status === "draft") {
          completed.splice(completedIndex, 1)
          drafts.push(updatedResume)
        } else {
          completed[completedIndex] = updatedResume
        }
      }

      if (!updatedResume) {
        throw new Error("Resume not found")
      }

      localStorage.setItem("resume_drafts", JSON.stringify(drafts))
      localStorage.setItem("saved_resumes", JSON.stringify(completed))

      return updatedResume
    }
  },
  async getResumes(): Promise<ResumeListResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes`)

      if (!response.ok) {
        throw new Error("Failed to fetch resumes")
      }

      const apiResponse: ApiResponse<ResumeListResponse> = await response.json()
      return apiResponse.data
    } catch (error) {
      console.error("API Error:", error)
      const drafts = JSON.parse(localStorage.getItem("resume_drafts") || "[]")
      const completed = JSON.parse(localStorage.getItem("saved_resumes") || "[]")
      const allResumes = [...drafts, ...completed].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )

      return {
        resumes: allResumes,
        total: allResumes.length,
      }
    }
  },
  async getResume(id: string): Promise<SavedResume> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch resume")
      }

      const apiResponse: ApiResponse<SavedResume> = await response.json()
      return apiResponse.data
    } catch (error) {
      const drafts = JSON.parse(localStorage.getItem("resume_drafts") || "[]")
      const completed = JSON.parse(localStorage.getItem("saved_resumes") || "[]")
      const allResumes = [...drafts, ...completed]
      const resume = allResumes.find((r: SavedResume) => r.id === id)

      if (!resume) {
        throw new Error("Resume not found")
      }
      return resume
    }
  },
  async deleteResume(id: string): Promise<void> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete resume")
      }
    } catch (error) {
      const drafts = JSON.parse(localStorage.getItem("resume_drafts") || "[]")
      const completed = JSON.parse(localStorage.getItem("saved_resumes") || "[]")
      const updatedDrafts = drafts.filter((r: SavedResume) => r.id !== id)
      const updatedCompleted = completed.filter((r: SavedResume) => r.id !== id)

      localStorage.setItem("resume_drafts", JSON.stringify(updatedDrafts))
      localStorage.setItem("saved_resumes", JSON.stringify(updatedCompleted))
    }
  },
}
