// src/components/cv-builder/CVBuilderLayout.jsx
import SectionNav  from './form/SectionNav'
import PersonalInfoForm  from './form/PersonalInfoForm'
import ExperienceForm    from './form/ExperienceForm'
import EducationForm     from './form/EducationForm'
import SkillsForm        from './form/SkillsForm'
import ProjectsForm      from './form/ProjectsForm'
import CVPreview         from './preview/CVPreview'
import { useCVBuilder }  from '../../context/CVBuilderContext'

const SECTIONS = {
  personalInfo:   <PersonalInfoForm />,
  experience:     <ExperienceForm />,
  education:      <EducationForm />,
  skills:         <SkillsForm />,
  projects:       <ProjectsForm />,
}

export default function CVBuilderLayout() {
  const { activeSection, title, setTitle, saving, handleSave } = useCVBuilder()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* ── Sidebar form (40%) ── */}
      <div className="w-2/5 flex flex-col border-r border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="text-sm font-medium border-none outline-none bg-transparent w-full"
          />
          <button
            onClick={handleSave}
            className="text-xs px-3 py-1 rounded bg-blue-600 text-white ml-2 shrink-0"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>

        {/* Nav */}
        <SectionNav />

        {/* Form content */}
        <div className="flex-1 overflow-y-auto p-4">
          {SECTIONS[activeSection]}
        </div>
      </div>

      {/* ── Preview (60%) ── */}
      <div className="w-3/5 overflow-y-auto bg-gray-100 flex items-start justify-center p-8">
        <CVPreview />
      </div>
    </div>
  )
}