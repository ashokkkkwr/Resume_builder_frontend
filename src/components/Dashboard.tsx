"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { resumeService, type SavedResume } from "../services/resumeService"
import { Button } from "./ui/Button"
import { useResume } from "../context/ResumeContext"
import {
  Plus,
  FileText,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MoreVertical,
  Star,
} from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Loading your resumes</h3>
          <p className="text-slate-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Resume Dashboard</h1>
                <p className="text-slate-600">Manage and create your professional resumes</p>
              </div>
            </div>
            <Button
              onClick={onCreateNew}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus size={18} />
              <span>Create New Resume</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resumes by name or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
                />
              </div>
              <div className="relative">
                <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="pl-12 pr-10 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-slate-50 hover:bg-white appearance-none transition-colors min-w-[160px]"
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
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText size={40} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              {searchTerm || filterStatus !== "all" ? "No resumes found" : "No resumes yet"}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Create your first professional resume to get started on your career journey."}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button
                onClick={onCreateNew}
                size="lg"
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
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
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">{resume.title}</h3>
                        <Star
                          size={16}
                          className="text-slate-300 hover:text-yellow-400 cursor-pointer transition-colors"
                        />
                      </div>
                      <p className="text-slate-600 text-sm font-medium">
                        {resume.personalInfo?.firstName || "Unknown"} {resume.personalInfo?.lastName || "User"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`
                        px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5
                        ${
                          resume.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      `}
                      >
                        {resume.status === "completed" ? <CheckCircle size={12} /> : <Clock size={12} />}
                        <span className="capitalize">{resume.status}</span>
                      </div>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <MoreVertical size={16} className="text-slate-400" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-slate-500 mb-6">
                    <Calendar size={12} className="mr-1.5" />
                    <span>Updated {formatDate(resume.updatedAt)}</span>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditResume(resume)}
                      className="flex-1 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    >
                      <Edit3 size={14} />
                      <span>Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
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
          <div className="mt-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Your Resume Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FileText size={24} className="text-slate-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{resumes.length}</div>
                <div className="text-sm font-medium text-slate-600">Total Resumes</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock size={24} className="text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-amber-600 mb-1">
                  {resumes.filter((r) => r.status === "draft").length}
                </div>
                <div className="text-sm font-medium text-slate-600">Drafts</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {resumes.filter((r) => r.status === "completed").length}
                </div>
                <div className="text-sm font-medium text-slate-600">Completed</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
