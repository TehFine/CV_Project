import { useState } from 'react'
import { useCVBuilder } from '../../../context/CVBuilderContext'

const EMPTY_EDU = {
  school: '', degree: '', field: '',
  startDate: '', endDate: '', gpa: '', description: ''
}

export default function EducationForm() {
  const { cvData, addItem, updateItem, removeItem } = useCVBuilder()
  const list = cvData.education
  const [expanded, setExpanded] = useState(null)

  const handleAdd = () => {
    addItem('education', EMPTY_EDU)
    setExpanded(list.length)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Học vấn</h3>
        <button
          onClick={handleAdd}
          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Thêm
        </button>
      </div>

      {list.length === 0 && (
        <p className="text-xs text-gray-400 italic text-center py-6">
          Chưa có thông tin học vấn. Nhấn "+ Thêm" để bắt đầu.
        </p>
      )}

      {list.map((edu, index) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between px-3 py-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === index ? null : index)}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {edu.school || 'Tên trường'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {[edu.degree, edu.field].filter(Boolean).join(' – ') || 'Bằng cấp'}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); removeItem('education', edu.id) }}
                className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Xóa
              </button>
              <span className="text-gray-400 text-sm">{expanded === index ? '▲' : '▼'}</span>
            </div>
          </div>

          {expanded === index && (
            <div className="p-3 space-y-3 border-t border-gray-100">
              <Field label="Tên trường" required>
                <input type="text" value={edu.school}
                  onChange={e => updateItem('education', edu.id, 'school', e.target.value)}
                  placeholder="VD: Đại học Bách Khoa TP.HCM"
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bằng cấp">
                  <select value={edu.degree}
                    onChange={e => updateItem('education', edu.id, 'degree', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Chọn bằng</option>
                    <option>Trung cấp</option>
                    <option>Cao đẳng</option>
                    <option>Cử nhân</option>
                    <option>Kỹ sư</option>
                    <option>Thạc sĩ</option>
                    <option>Tiến sĩ</option>
                  </select>
                </Field>
                <Field label="Chuyên ngành">
                  <input type="text" value={edu.field}
                    onChange={e => updateItem('education', edu.id, 'field', e.target.value)}
                    placeholder="VD: Công nghệ thông tin"
                    className={inputCls}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Từ năm">
                  <input type="month" value={edu.startDate}
                    onChange={e => updateItem('education', edu.id, 'startDate', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Đến năm">
                  <input type="month" value={edu.endDate}
                    onChange={e => updateItem('education', edu.id, 'endDate', e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="GPA">
                <input type="text" value={edu.gpa}
                  onChange={e => updateItem('education', edu.id, 'gpa', e.target.value)}
                  placeholder="VD: 3.6 / 4.0"
                  className={inputCls}
                />
              </Field>
              <Field label="Ghi chú">
                <textarea rows={2} value={edu.description}
                  onChange={e => updateItem('education', edu.id, 'description', e.target.value)}
                  placeholder="Thành tích, hoạt động nổi bật..."
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}