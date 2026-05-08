import { PhotoSection }          from './sections/PhotoSection'
import { PersonalSection }       from './sections/PersonalSection'
import { ExperienceSection }     from './sections/ExperienceSection'
import { EducationSection }      from './sections/EducationSection'
import { SkillsSection }         from './sections/SkillsSection'
import { LanguagesSection }      from './sections/LanguagesSection'
import { CertificationsSection } from './sections/CertificationsSection'

export function EditorPanel({ cv, onChange }) {
  const handlePersonal = (key, val) =>
    onChange(cv => ({ ...cv, personal: { ...cv.personal, [key]: val } }))

  const handlePhoto = (val) =>
    onChange(cv => ({ ...cv, personal: { ...cv.personal, photo: val } }))

  return (
    <div className="space-y-3">
      <PhotoSection
        photo={cv.personal.photo}
        onChange={handlePhoto}
      />
      <PersonalSection
        data={cv.personal}
        onChange={handlePersonal}
      />
      <ExperienceSection
        items={cv.experience}
        onChange={onChange}
      />
      <EducationSection
        items={cv.education}
        onChange={onChange}
      />
      <SkillsSection
        items={cv.skills}
        onChange={onChange}
      />
      <LanguagesSection
        items={cv.languages}
        onChange={onChange}
      />
      <CertificationsSection
        items={cv.certifications}
        onChange={onChange}
      />
    </div>
  )
}
