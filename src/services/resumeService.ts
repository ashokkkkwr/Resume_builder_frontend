import type { ResumeData } from "../types/resume"
import { env } from "../config/env"
import { v4 as uuidv4 } from "uuid"

export interface SavedResume {
  id: string
  title: string
  data: ResumeData
  status: "draft" | "completed"
  createdAt: string
  updatedAt: string
}

export interface ResumeListResponse {
  resumes: SavedResume[]
  total: number
}

const API_BASE_URL = env.API_BASE_URL

// Create a fetch wrapper with timeout
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
  // Save draft resume
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

      return await response.json()
    } catch (error) {
      // For demo purposes, simulate API success with localStorage
      const draft: SavedResume = {
        id: uuidv4(),
        title: title || `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`,
        data: resumeData,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage for demo
      const existingDrafts = JSON.parse(localStorage.getItem("resume_drafts") || "[]")
      existingDrafts.push(draft)
      localStorage.setItem("resume_drafts", JSON.stringify(existingDrafts))

      return draft
    }
  },

  // Save completed resume
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

      return await response.json()
    } catch (error) {
      // For demo purposes, simulate API success with localStorage
      const savedResume: SavedResume = {
        id: uuidv4(),
        title: title || `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} Resume`,
        data: resumeData,
        status: "completed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Save to localStorage for demo
      const existingResumes = JSON.parse(localStorage.getItem("saved_resumes") || "[]")
      existingResumes.push(savedResume)
      localStorage.setItem("saved_resumes", JSON.stringify(existingResumes))

      return savedResume
    }
  },

  // Update existing resume
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

      return await response.json()
    } catch (error) {
      // For demo purposes, update in localStorage
      const storageKey = status === "draft" ? "resume_drafts" : "saved_resumes"
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]")
      const index = existing.findIndex((r: SavedResume) => r.id === id)

      if (index !== -1) {
        existing[index] = {
          ...existing[index],
          data: resumeData,
          status,
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(storageKey, JSON.stringify(existing))
        return existing[index]
      }

      throw new Error("Resume not found")
    }
  },

  // Get all resumes
  async getResumes(): Promise<ResumeListResponse> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes`)

      if (!response.ok) {
        throw new Error("Failed to fetch resumes")
      }

      return await response.json()
    } catch (error) {
      // For demo purposes, get from localStorage
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

  // Get single resume
  async getResume(id: string): Promise<SavedResume> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch resume")
      }

      return await response.json()
    } catch (error) {
      // For demo purposes, get from localStorage
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

  // Delete resume
  async deleteResume(id: string): Promise<void> {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/resume/resumes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete resume")
      }
    } catch (error) {
      // For demo purposes, delete from localStorage
      const drafts = JSON.parse(localStorage.getItem("resume_drafts") || "[]")
      const completed = JSON.parse(localStorage.getItem("saved_resumes") || "[]")

      const updatedDrafts = drafts.filter((r: SavedResume) => r.id !== id)
      const updatedCompleted = completed.filter((r: SavedResume) => r.id !== id)

      localStorage.setItem("resume_drafts", JSON.stringify(updatedDrafts))
      localStorage.setItem("saved_resumes", JSON.stringify(updatedCompleted))
    }
  },
}
