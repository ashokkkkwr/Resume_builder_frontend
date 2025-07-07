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
  const token = localStorage.getItem("token")

  if (!token) {
    return <LoginPage />
  }

  const [currentView, setCurrentView] = useState<AppView>("dashboard")
  const [editingResume, setEditingResume] = useState<SavedResume | null>(null)

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" onClick={handleBackToDashboard} className="p-2">
                    <ArrowLeft size={20} />
                  </Button>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {editingResume ? "Edit Resume" : "Resume Builder"}
                    </h1>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-saving</span>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-4 py-6 lg:py-8">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
              <div className="xl:col-span-7 order-2 xl:order-1">
                <FormContainer />
              </div>

              <div className="xl:col-span-5 order-1 xl:order-2">
                <div className="sticky top-24">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">Real-time</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">See your resume update as you type</p>
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
