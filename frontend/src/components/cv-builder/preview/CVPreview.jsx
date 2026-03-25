// src/components/cv-builder/preview/CVPreview.jsx
import { useRef } from 'react'
import { useCVBuilder } from '../../../context/CVBuilderContext'

export default function CVPreview() {
  const { cvData } = useCVBuilder()
  const { personalInfo, experience, education, skills, projects } = cvData
  const previewRef = useRef()

  const handleExportPDF = () => {
    window.print()   // tạm thời dùng print, sau thay bằng html2canvas + jsPDF
  }

  return (
    <div className="w-full max-w-[794px]">
      {/* Nút export */}
      <div className="flex justify-end mb-3">
        <button
          onClick={handleExportPDF}
          className="text-xs px-4 py-2 bg-green-600 text-white rounded"
        >
          Xuất PDF
        </button>
      </div>

      {/* Trang CV — kích thước A4 */}
      <div
        ref={previewRef}
        className="bg-white shadow-lg"
        style={{ width: '794px', minHeight: '1123px', padding: '48px', fontFamily: 'Georgia, serif' }}
      >
        {/* Header */}
        <div className="border-b-2 border-blue-700 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{personalInfo.fullName || 'Họ và tên'}</h1>
          <p className="text-blue-700 font-medium mt-1">{personalInfo.jobTitle}</p>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
            {personalInfo.email   && <span>{personalInfo.email}</span>}
            {personalInfo.phone   && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <Section title="Giới thiệu">
            <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section title="Kinh nghiệm làm việc">
            {experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{exp.position}</span>
                  <span className="text-xs text-gray-500">{exp.startDate} – {exp.current ? 'Hiện tại' : exp.endDate}</span>
                </div>
                <p className="text-sm text-blue-700">{exp.company}</p>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <Section title="Học vấn">
            {education.map(edu => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{edu.school}</span>
                  <span className="text-xs text-gray-500">{edu.startDate} – {edu.endDate}</span>
                </div>
                <p className="text-sm text-gray-600">{edu.degree} {edu.field && `– ${edu.field}`}</p>
                {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section title="Kỹ năng">
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                  {skill.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="Dự án">
            {projects.map(proj => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">{proj.name}</span>
                  {proj.url && <a href={proj.url} className="text-xs text-blue-600">{proj.url}</a>}
                </div>
                {proj.techStack && <p className="text-xs text-gray-500">{proj.techStack}</p>}
                <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}

// Component tiêu đề section
function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-bold text-blue-700 uppercase tracking-wide border-b border-blue-200 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  )
}