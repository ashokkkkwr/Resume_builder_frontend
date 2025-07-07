"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { resumeService, type SavedResume } from "../services/resumeService"
import { Button } from "./ui/Button"
import { useResume } from "../context/ResumeContext"
import { Plus, FileText, Edit3, Trash2, Calendar, CheckCircle, Clock, Search, Filter } from "lucide-react"

interface DashboardProps {
  onCreateNew: () => void
  onEditResume: (resume: SavedResume) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onCreateNew, onEditResume }) => {
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "completed">("all")
  const { setIsLoading } = useResume()

  useEffect(() => {
    loadResumes()
  }, [])

  const loadResumes = async () => {
    try {
      setLoading(true)
      const response = await resumeService.getResumes()
      console.log("API Response:", response)
      setResumes(response.resumes ?? [])
    } catch (error) {
      console.error("Failed to load resumes:", error)
      setResumes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        setIsLoading(true)
        await resumeService.deleteResume(id)
        await loadResumes()
      } catch (error) {
        alert("Failed to delete resume. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const filteredResumes = resumes.filter((resume) => {
    // Safe access to personalInfo
    const firstName = resume.personalInfo?.firstName || ""
    const lastName = resume.personalInfo?.lastName || ""
    const title = resume.title || ""

    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lastName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || resume.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Resume Dashboard
              </h1>
            </div>
            <Button onClick={onCreateNew} className="px-6 py-2">
              <Plus size={16} />
              <span>Create New Resume</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
                />
              </div>
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 appearance-none"
                >
                  <option value="all">All Resumes</option>
                  <option value="draft">Drafts</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Grid */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm || filterStatus !== "all" ? "No resumes found" : "No resumes yet"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first professional resume to get started on your career journey."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button onClick={onCreateNew} size="lg" className="px-8 py-3">
                <Plus size={20} />
                <span>Create Your First Resume</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{resume.title}</h3>
                      <p className="text-gray-600 text-sm">
                        {resume.personalInfo?.firstName || "Unknown"} {resume.personalInfo?.lastName || "User"}
                      </p>
                    </div>
                    <div
                      className={`
                      px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1
                      ${resume.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}
                    `}
                    >
                      {resume.status === "completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                      <span className="capitalize">{resume.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar size={12} className="mr-1" />
                    <span>Updated {formatDate(resume.updatedAt)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEditResume(resume)} className="flex-1">
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(resume.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {resumes.length > 0 && (
          <div className="mt-12 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl shadow-blue-500/5 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Resume Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{resumes.length}</div>
                <div className="text-sm text-gray-600">Total Resumes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {resumes.filter((r) => r.status === "draft").length}
                </div>
                <div className="text-sm text-gray-600">Drafts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {resumes.filter((r) => r.status === "completed").length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
