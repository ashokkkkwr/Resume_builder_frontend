"use client"

import LoginPage from "./components/Login"
import { ResumeProvider } from "./context/ResumeContext"
import { FormContainer } from "./components/FormContainer"
import { ResumePreview } from "./components/ResumePreview"
import { Dashboard } from "./components/Dashboard"
import type { SavedResume } from "./services/resumeService"
import { useState } from "react"
import { Button } from "./components/ui/Button"
import { ArrowLeft } from "lucide-react"
import type { ResumeData } from "./types/resume"

type AppView = "dashboard" | "builder"

function App() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard")
  const [editingResume, setEditingResume] = useState<SavedResume | null>(null)
  const token = localStorage.getItem("token")

  if (!token) {
    return <LoginPage />
  }

  const handleCreateNew = () => {
    setEditingResume(null)
    setCurrentView("builder")
  }

  const handleEditResume = (resume: SavedResume) => {
    const resumeData: ResumeData = {
      personalInfo: resume.personalInfo,
      workExperience: resume.workExperience || [],
      education: resume.education || [],
      skills: resume.skills || [],
      summary: resume.summary || { content: "" },
    }

    setEditingResume(resume)
    setCurrentView("builder")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setEditingResume(null)
  }

  return (
    <ResumeProvider
      initialData={
        editingResume
          ? {
              personalInfo: editingResume.personalInfo,
              workExperience: editingResume.workExperience,
              education: editingResume.education,
              skills: editingResume.skills,
              summary: editingResume.summary,
            }
          : undefined
      }
      editingResumeId={editingResume?.id}
    >
      {currentView === "dashboard" ? (
        <Dashboard onCreateNew={handleCreateNew} onEditResume={handleEditResume} />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={handleBackToDashboard}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <ArrowLeft size={20} className="text-slate-600" />
                  </Button>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">R</span>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">
                        {editingResume ? "Edit Resume" : "Resume Builder"}
                      </h1>
                      <p className="text-sm text-slate-500">Create your professional resume</p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-3 bg-emerald-50 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-700">Auto-saving</span>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              <div className="xl:col-span-7 order-2 xl:order-1">
                <FormContainer />
              </div>

              <div className="xl:col-span-5 order-1 xl:order-2">
                <div className="sticky top-28">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
                      <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-blue-700">Real-time</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">See your resume update as you type</p>
                  </div>
                  <ResumePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ResumeProvider>
  )
}

export default App
