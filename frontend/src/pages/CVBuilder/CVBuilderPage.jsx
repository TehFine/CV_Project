// src/pages/CVBuilderPage.jsx
import { useParams } from 'react-router-dom'
import { CVBuilderProvider } from '../../context/CVBuilderContext'
import CVBuilderLayout from '../../components/cv-builder/CVBuilderLayout'

export default function CVBuilderPage() {
  const { id } = useParams()   // undefined nếu tạo mới, có id nếu edit
  return (
    <div>
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A6E 50%, #1549B8 100%)',
        paddingTop: 80, paddingBottom: 40,
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="container-app">
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Tạo CV của bạn
          </h1>
          <p style={{ color: '#C4B5FD', fontSize: 18 }}>Dễ dàng tạo CV chuyên nghiệp với công cụ AI</p>
        </div>
      </section>
      <CVBuilderProvider resumeId={id}>
        <CVBuilderLayout />
      </CVBuilderProvider>
    </div>
  )
}