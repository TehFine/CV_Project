// src/context/CVBuilderContext.jsx
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { cvService } from '../services/cvService'

const CVBuilderContext = createContext(null)

const DEFAULT_CV = {
  personalInfo: {
    fullName: '', jobTitle: '', email: '',
    phone: '', address: '', website: '', summary: ''
  },
  experience:     [],
  education:      [],
  skills:         [],
  projects:       [],
  certifications: [],
  languages:      [],
}

export function CVBuilderProvider({ children, resumeId }) {
  const [cvData,   setCvData]   = useState(DEFAULT_CV)
  const [title,    setTitle]    = useState('CV của tôi')
  const [saving,   setSaving]   = useState(false)
  const [activeSection, setActiveSection] = useState('personalInfo')
  const autoSaveTimer = useRef(null)

  // Load CV nếu đang edit bản có sẵn
  useEffect(() => {
    if (resumeId) {
      cvService.getResume(resumeId).then(res => {
        setTitle(res.title)
        setCvData(res.content)
      })
    }
  }, [resumeId])

  // Auto-save sau 2 giây không gõ
  useEffect(() => {
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      handleSave()
    }, 2000)
    return () => clearTimeout(autoSaveTimer.current)
  }, [cvData, title])

  const updatePersonalInfo = useCallback((field, value) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }, [])

  // Generic update cho các section dạng array
  const addItem = useCallback((section, item) => {
    setCvData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...item, id: crypto.randomUUID() }]
    }))
  }, [])

  const updateItem = useCallback((section, id, field, value) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }))
  }, [])

  const removeItem = useCallback((section, id) => {
    setCvData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }))
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await cvService.saveResume({
        id: resumeId,
        title,
        content: cvData,
        source: 'builder',
      })
    } finally {
      setSaving(false)
    }
  }, [cvData, title, resumeId])

  return (
    <CVBuilderContext.Provider value={{
      cvData, title, saving, activeSection,
      setTitle, setActiveSection,
      updatePersonalInfo, addItem, updateItem, removeItem,
      handleSave,
    }}>
      {children}
    </CVBuilderContext.Provider>
  )
}

export const useCVBuilder = () => {
  const ctx = useContext(CVBuilderContext)
  if (!ctx) throw new Error('useCVBuilder must be used within CVBuilderProvider')
  return ctx
}