import { useState } from 'react'
import { useCVBuilder } from '../../../context/CVBuilderContext'

const EMPTY_PROJ = {
  name: '', description: '', techStack: '',
  url: '', startDate: '', endDate: ''
}

export default function ProjectsForm() {
  const { cvData, addItem, updateItem, removeItem } = useCVBuilder()
  const list = cvData.projects
  const [expanded, setExpanded] = useState(null)

  const handleAdd = () => {
    addItem('projects', EMPTY_PROJ)
    setExpanded(list.length)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Dự án</h3>
        <button
          onClick={handleAdd}
          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          + Thêm
        </button>
      </div>

      {list.length === 0 && (
        <p className="text-xs text-gray-400 italic text-center py-6">
          Chưa có dự án nào. Nhấn "+ Thêm" để bắt đầu.
        </p>
      )}

      {list.map((proj, index) => (
        <div key={proj.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div
            className="flex items-center justify-between px-3 py-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setExpanded(expanded === index ? null : index)}
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {proj.name || 'Tên dự án'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {proj.techStack || 'Tech stack'}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2 shrink-0">
              <button
                onClick={e => { e.stopPropagation(); removeItem('projects', proj.id) }}
                className="text-red-400 hover:text-red-600 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Xóa
              </button>
              <span className="text-gray-400 text-sm">{expanded === index ? '▲' : '▼'}</span>
            </div>
          </div>

          {expanded === index && (
            <div className="p-3 space-y-3 border-t border-gray-100">
              <Field label="Tên dự án" required>
                <input type="text" value={proj.name}
                  onChange={e => updateItem('projects', proj.id, 'name', e.target.value)}
                  placeholder="VD: NexCV – Nền tảng tuyển dụng AI"
                  className={inputCls}
                />
              </Field>
              <Field label="Công nghệ sử dụng">
                <input type="text" value={proj.techStack}
                  onChange={e => updateItem('projects', proj.id, 'techStack', e.target.value)}
                  placeholder="VD: React, Node.js, PostgreSQL, Flask"
                  className={inputCls}
                />
              </Field>
              <Field label="Link dự án / GitHub">
                <input type="url" value={proj.url}
                  onChange={e => updateItem('projects', proj.id, 'url', e.target.value)}
                  placeholder="https://github.com/..."
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Bắt đầu">
                  <input type="month" value={proj.startDate}
                    onChange={e => updateItem('projects', proj.id, 'startDate', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Kết thúc">
                  <input type="month" value={proj.endDate}
                    onChange={e => updateItem('projects', proj.id, 'endDate', e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
              <Field label="Mô tả dự án">
                <textarea rows={4} value={proj.description}
                  onChange={e => updateItem('projects', proj.id, 'description', e.target.value)}
                  placeholder="Mô tả chức năng, vai trò của bạn, kết quả đạt được..."
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