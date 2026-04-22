export const DEFAULT_CV = {
  personal: {
    name: 'Nguyễn Văn An',
    title: 'Frontend Developer',
    email: 'an.nguyen@email.com',
    phone: '0901 234 567',
    location: 'TP. Hồ Chí Minh',
    linkedin: 'linkedin.com/in/nguyenvanan',
    website: '',
    summary: 'Frontend Developer với 3 năm kinh nghiệm xây dựng ứng dụng web hiện đại. Thành thạo React, TypeScript và TailwindCSS. Đam mê tạo ra những sản phẩm đẹp, hiệu năng cao và trải nghiệm người dùng xuất sắc.',
  },
  experience: [
    {
      id: 1,
      company: 'VNG Corporation',
      role: 'Frontend Developer',
      period: '01/2022 – Hiện tại',
      location: 'TP. Hồ Chí Minh',
      bullets: [
        'Phát triển và duy trì các tính năng cho ứng dụng Zalo Web với 70M+ người dùng.',
        'Tối ưu hóa hiệu năng, giảm 40% thời gian tải trang.',
        'Mentoring 3 junior developer trong nhóm.',
      ],
    },
    {
      id: 2,
      company: 'Startup XYZ',
      role: 'Junior Frontend Developer',
      period: '06/2021 – 12/2021',
      location: 'TP. Hồ Chí Minh',
      bullets: [
        'Xây dựng giao diện người dùng với React và Redux.',
        'Tích hợp RESTful API và xử lý state management.',
      ],
    },
  ],
  education: [
    {
      id: 1,
      school: 'Đại học Bách Khoa TP.HCM',
      degree: 'Cử nhân Kỹ thuật Phần mềm',
      period: '2017 – 2021',
      gpa: '3.5/4.0',
    },
  ],
  skills: [
    { id: 1, category: 'Frontend', items: 'React, TypeScript, JavaScript, HTML, CSS, TailwindCSS' },
    { id: 2, category: 'Backend', items: 'Node.js, Express, RESTful API' },
    { id: 3, category: 'Tools', items: 'Git, Docker, Figma, Vite, Webpack' },
  ],
  languages: [
    { id: 1, lang: 'Tiếng Việt', level: 'Bản ngữ' },
    { id: 2, lang: 'Tiếng Anh', level: 'Thành thạo (IELTS 7.0)' },
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2023' },
  ],
}

export const uid = () => Date.now() + Math.random()
