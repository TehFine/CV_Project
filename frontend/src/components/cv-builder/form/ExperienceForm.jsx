import { useState } from 'react'
import { useCVBuilder } from '../../../context/CVBuilderContext'

const EMPTY_EXP = {
  company: '', position: '', location: '',
  startDate: '', endDate: '', current: false, description: ''
}

export default function ExperienceForm() {
  const { cvData, addItem, updateItem, removeItem } = useCVBuilder()
  const list = cvData.experience
  const [expanded, setExpanded] = useState(null)

  const handleAdd = () => {
    addItem('experience', EMPTY_EXP)
    // Tự động mở item vừa thêm
    setExpanded(list.length)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Kinh nghiệm làm việc</h3>
        <button
          onClick={handleAdd}
          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Thêm
        </button>
      </div>

      {list.length === 0 && (
        <p className="text-xs text-gray-400 italic text-center py-6">
          Chưa có kinh nghiệm nào. Nhấn "+ Thêm" để bắt đầu.
        </p>
      )}

      {list.map((exp, index) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Accordion header */}
          <div
            className="flex items-center justify-between px-3 py-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === index ? null : index)}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {exp.position || 'Vị trí công việc'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {exp.company || 'Tên công ty'}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); removeItem('experience', exp.id) }}
                className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Xóa
              </button>
              <span className="text-gray-400 text-sm">{expanded === index ? '▲' : '▼'}</span>
            </div>
          </div>

          {/* Accordion body */}
          {expanded === index && (
            <div className="p-3 space-y-3 border-t border-gray-100">
              <Field label="Vị trí / Chức danh" required>
                <input type="text" value={exp.position}
                  onChange={e => updateItem('experience', exp.id, 'position', e.target.value)}
                  placeholder="VD: Frontend Developer"
                  className={inputCls}
                />
              </Field>
              <Field label="Tên công ty" required>
                <input type="text" value={exp.company}
                  onChange={e => updateItem('experience', exp.id, 'company', e.target.value)}
                  placeholder="VD: FPT Software"
                  className={inputCls}
                />
              </Field>
              <Field label="Địa điểm">
                <input type="text" value={exp.location}
                  onChange={e => updateItem('experience', exp.id, 'location', e.target.value)}
                  placeholder="VD: TP. Hồ Chí Minh"
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Ngày bắt đầu">
                  <input type="month" value={exp.startDate}
                    onChange={e => updateItem('experience', exp.id, 'startDate', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Ngày kết thúc">
                  <input type="month" value={exp.endDate}
                    disabled={exp.current}
                    onChange={e => updateItem('experience', exp.id, 'endDate', e.target.value)}
                    className={`${inputCls} disabled:bg-gray-50 disabled:text-gray-400`}
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={e => updateItem('experience', exp.id, 'current', e.target.checked)}
                  className="w-3.5 h-3.5 accent-blue-600"
                />
                <span className="text-xs text-gray-600">Đang làm việc tại đây</span>
              </label>
              <Field label="Mô tả công việc">
                <textarea
                  rows={4}
                  value={exp.description}
                  onChange={e => updateItem('experience', exp.id, 'description', e.target.value)}
                  placeholder="Mô tả trách nhiệm, thành tích đạt được (mỗi ý một dòng)..."
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