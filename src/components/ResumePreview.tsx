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
        handleDownloadPDF()
      }
    } else {
      handleDownloadPDF()
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-slate-300 hover:border-slate-400 bg-transparent"
          onClick={handleDownloadPDF}
          disabled={isLoading}
        >
          <Download size={16} />
          <span>{isLoading ? "Generating..." : "Download PDF"}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 text-slate-600 hover:text-slate-900"
          onClick={handleShare}
          disabled={isLoading}
        >
          <Share2 size={16} />
          <span>Share</span>
        </Button>
      </div>

      {/* Resume Preview */}
      <div id="resume-preview" className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-3">
                {hasPersonalInfo ? `${personalInfo.firstName} ${personalInfo.lastName}` : "Your Name"}
              </h1>
              {personalInfo.location && <p className="text-slate-300 text-lg font-medium">{personalInfo.location}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {personalInfo.email && (
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail size={16} className="text-white" />
                  </div>
                  <span className="font-medium">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-white" />
                  </div>
                  <span className="font-medium">{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Globe size={16} className="text-white" />
                  </div>
                  <span className="font-medium truncate">{personalInfo.website}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Linkedin size={16} className="text-white" />
                  </div>
                  <span className="font-medium">LinkedIn Profile</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Github size={16} className="text-white" />
                  </div>
                  <span className="font-medium">GitHub Profile</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-10">
          {hasSummary && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-3 border-b-2 border-slate-900">
                Professional Summary
              </h2>
              <p className="text-slate-700 leading-relaxed text-lg">{summary?.content || ""}</p>
            </section>
          )}

          {hasWorkExperience && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-900">
                Work Experience
              </h2>
              <div className="space-y-8">
                {workExperience.map((exp) => (
                  <div key={exp.id} className="relative pl-8 border-l-2 border-slate-200">
                    <div className="absolute w-4 h-4 bg-slate-900 rounded-full -left-2.5 top-2"></div>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{exp.position}</h3>
                          <p className="text-slate-700 font-semibold text-lg">{exp.company}</p>
                          <p className="text-slate-600">{exp.location}</p>
                        </div>
                        <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-full mt-3 sm:mt-0 self-start">
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasEducation && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-900">Education</h2>
              <div className="space-y-6">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-slate-700 font-semibold text-lg">{edu.institution}</p>
                        <p className="text-slate-600">{edu.location}</p>
                        {edu.gpa && <p className="text-sm text-slate-600 mt-2 font-medium">GPA: {edu.gpa}</p>}
                      </div>
                      <span className="text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-full mt-3 sm:mt-0 self-start border border-slate-200">
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-3 border-b-2 border-slate-900">
                Skills & Expertise
              </h2>
              <div className="space-y-6">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-4 text-lg">{category}</h3>
                    <div className="flex flex-wrap gap-3">
                      {categorySkills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-slate-900 text-white shadow-sm"
                        >
                          {skill.name}
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">{skill.level}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!hasPersonalInfo && !hasWorkExperience && !hasEducation && !hasSkills && !hasSummary && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Start Building Your Resume</h3>
              <p className="text-slate-600 text-lg">Your resume preview will appear here as you fill out the form.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
