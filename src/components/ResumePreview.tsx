"use client"

import type React from "react"
import { useResume } from "../context/ResumeContext"
import { formatDate } from "../utils/validation"
import { Mail, Phone, Globe, Linkedin, Github, Download, Share2 } from "lucide-react"
import { Button } from "./ui/Button"
import { PDFService } from "../services/pdfService"

export const ResumePreview: React.FC = () => {
  const { resumeData, isLoading, setIsLoading } = useResume()
  const { personalInfo, workExperience, education, skills, summary } = resumeData

  const hasPersonalInfo = personalInfo.firstName || personalInfo.lastName
  const hasWorkExperience = workExperience.length > 0
  const hasEducation = education.length > 0
  const hasSkills = skills.length > 0
  const hasSummary = summary && summary.content && summary.content.trim().length > 0

  const groupedSkills = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true)
      await PDFService.generatePDF(resumeData, "resume-preview")
    } catch (error) {
      alert("Failed to generate PDF. Please try again.")
      console.error("PDF generation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const blob = await PDFService.generatePDFBlob(resumeData, "resume-preview")
        const file = new File([blob], `${personalInfo.firstName}_${personalInfo.lastName}_Resume.pdf`, {
          type: "application/pdf",
        })

        await navigator.share({
          title: `${personalInfo.firstName} ${personalInfo.lastName} Resume`,
          text: "Check out my professional resume",
          files: [file],
        })
      } catch (error) {
        console.error("Error sharing:", error)
        // Fallback to download
        handleDownloadPDF()
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleDownloadPDF()
    }
  }

  return (
    <div className="space-y-4">
      {/* Preview Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 bg-transparent"
          onClick={handleDownloadPDF}
          disabled={isLoading}
        >
          <Download size={14} />
          <span>{isLoading ? "Generating..." : "Download PDF"}</span>
        </Button>
        <Button variant="ghost" size="sm" className="flex-1" onClick={handleShare} disabled={isLoading}>
          <Share2 size={14} />
          <span>Share</span>
        </Button>
      </div>

      {/* Resume Preview */}
      <div id="resume-preview" className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 text-white p-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                {hasPersonalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}` : "Your Name"}
              </h1>
              {personalInfo.location && <p className="text-gray-300 text-lg">{personalInfo.location}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {personalInfo.email && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Mail size={16} className="text-blue-400" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Phone size={16} className="text-blue-400" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Globe size={16} className="text-blue-400" />
                  <span className="truncate">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Linkedin size={16} className="text-blue-400" />
                  <span>LinkedIn Profile</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center space-x-2 text-gray-300">
                  <Github size={16} className="text-blue-400" />
                  <span>GitHub Profile</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-8">
          {hasSummary && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">{summary?.content || ""}</p>
            </section>
          )}

          {hasWorkExperience && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">Work Experience</h2>
              <div className="space-y-6">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200">
                    <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-2 top-1"></div>
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <p className="text-blue-600 font-medium">{exp.company}</p>
                          <p className="text-gray-600 text-sm">{exp.location}</p>
                        </div>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full mt-2 sm:mt-0 self-start">
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasEducation && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">Education</h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-blue-600 font-medium">{edu.institution}</p>
                        <p className="text-gray-600 text-sm">{edu.location}</p>
                        {edu.gpa && <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full mt-2 sm:mt-0 self-start">
                        {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasSkills && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-500">
                Skills & Expertise
              </h2>
              <div className="space-y-4">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm"
                        >
                          {skill.name}
                          <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">{skill.level}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!hasPersonalInfo && !hasWorkExperience && !hasEducation && !hasSkills && !hasSummary && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📄</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Resume</h3>
              <p className="text-gray-500">Your resume preview will appear here as you fill out the form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
