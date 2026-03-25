// src/components/cv-builder/form/PersonalInfoForm.jsx
import { useCVBuilder } from '../../../context/CVBuilderContext'

const FIELDS = [
  { key: 'fullName',  label: 'Họ và tên',       type: 'text' },
  { key: 'jobTitle',  label: 'Vị trí ứng tuyển', type: 'text' },
  { key: 'email',     label: 'Email',             type: 'email' },
  { key: 'phone',     label: 'Số điện thoại',     type: 'tel' },
  { key: 'address',   label: 'Địa chỉ',           type: 'text' },
  { key: 'website',   label: 'Website / LinkedIn', type: 'url' },
]

export default function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVBuilder()
  const info = cvData.personalInfo

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Thông tin cá nhân</h3>
      {FIELDS.map(f => (
        <div key={f.key}>
          <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
          <input
            type={f.type}
            value={info[f.key]}
            onChange={e => updatePersonalInfo(f.key, e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
      ))}
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Giới thiệu bản thân</label>
        <textarea
          rows={4}
          value={info.summary}
          onChange={e => updatePersonalInfo('summary', e.target.value)}
          className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
        />
      </div>
    </div>
  )
}