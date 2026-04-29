import { useState } from 'react'
import { useCVBuilder } from '../../../context/CVBuilderContext'

const LEVELS = ['Cơ bản', 'Trung bình', 'Khá', 'Thành thạo', 'Chuyên gia']

const LEVEL_COLOR = {
  'Cơ bản':    'bg-gray-100 text-gray-600',
  'Trung bình':'bg-blue-50 text-blue-600',
  'Khá':       'bg-cyan-50 text-cyan-700',
  'Thành thạo':'bg-green-50 text-green-700',
  'Chuyên gia':'bg-purple-50 text-purple-700',
}

export default function SkillsForm() {
  const { cvData, addItem, updateItem, removeItem } = useCVBuilder()
  const list = cvData.skills
  const [name,  setName]  = useState('')
  const [level, setLevel] = useState('Trung bình')

  const handleAdd = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    addItem('skills', { name: trimmed, level })
    setName('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Kỹ năng</h3>

      {/* Quick add */}
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tên kỹ năng (Enter để thêm)"
          className={`${inputCls} flex-1`}
        />
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          className={`${inputCls} w-32 shrink-0`}
        >
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
        <button
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors shrink-0"
        >
          + Thêm
        </button>
      </div>

      {/* Skill tags */}
      {list.length === 0 ? (
        <p className="text-xs text-gray-400 italic text-center py-4">
          Nhập tên kỹ năng và nhấn Enter để thêm nhanh.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {list.map(skill => (
            <div
              key={skill.id}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${LEVEL_COLOR[skill.level] || 'bg-gray-100 text-gray-600'}`}
            >
              <span>{skill.name}</span>
              <select
                value={skill.level}
                onChange={e => updateItem('skills', skill.id, 'level', e.target.value)}
                className="bg-transparent border-none outline-none text-xs cursor-pointer"
                title="Đổi mức độ"
              >
                {LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
              <button
                onClick={() => removeItem('skills', skill.id)}
                className="ml-0.5 opacity-60 hover:opacity-100 leading-none"
                title="Xóa"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        Nhấn vào mức độ trên tag để thay đổi. Nhấn × để xóa kỹ năng.
      </p>
    </div>
  )
}