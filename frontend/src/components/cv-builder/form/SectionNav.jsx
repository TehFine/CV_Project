// src/components/cv-builder/form/SectionNav.jsx
import { useCVBuilder } from '../../../context/CVBuilderContext'

const TABS = [
  { key: 'personalInfo', label: 'Thông tin' },
  { key: 'experience',   label: 'Kinh nghiệm' },
  { key: 'education',    label: 'Học vấn' },
  { key: 'skills',       label: 'Kỹ năng' },
  { key: 'projects',     label: 'Dự án' },
]

export default function SectionNav() {
  const { activeSection, setActiveSection } = useCVBuilder()
  return (
    <div className="flex overflow-x-auto border-b px-2 gap-1 py-1">
      {TABS.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveSection(tab.key)}
          className={`px-3 py-1.5 text-xs rounded whitespace-nowrap transition-colors
            ${activeSection === tab.key
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}