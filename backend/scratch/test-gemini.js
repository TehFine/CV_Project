const { readFileSync } = require('fs');

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = `Bạn là một hệ thống ATS chuyên nghiệp. Hãy phân tích CV ứng viên.
Vị trí: Backend Developer
CV Content: Nguyễn Văn A. Kinh nghiệm: 2 năm làm Node.js, NestJS. Từng làm hệ thống eCommerce có 10k người dùng. Kỹ năng: Node.js, MongoDB, Docker. Học vấn: Đại học Bách Khoa, GPA 3.5.

Hãy trả về JSON chứa các trường sau:
{
  "overall": (số 1-100),
  "grade": "A/B/C/D",
  "gradeLabel": "Tốt/Khá/Trung bình/Yếu",
  "strengths": ["điểm mạnh 1", "điểm mạnh 2"],
  "improvements": ["điểm cần sửa 1", "điểm cần sửa 2"],
  "categories": [
    { "key": "skills_match", "label": "Kỹ năng", "score": 80, "feedback": "...", "suggestions": ["..."] },
    { "key": "experience", "label": "Kinh nghiệm", "score": 70, "feedback": "...", "suggestions": ["..."] },
    { "key": "education", "label": "Học vấn", "score": 90, "feedback": "...", "suggestions": ["..."] },
    { "key": "format", "label": "Trình bày", "score": 85, "feedback": "...", "suggestions": ["..."] },
    { "key": "keywords", "label": "Từ khóa ATS", "score": 75, "feedback": "...", "suggestions": ["..."] }
  ]
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        
        responseMimeType: "application/json"
      },
    }),
  });
  
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("Finish Reason:", data?.candidates?.[0]?.finishReason); console.log("RAW TEXT:");
  console.log(text);
  
  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    JSON.parse(cleaned);
    console.log("JSON is valid!");
  } catch(e) {
    console.error("Parse error:", e.message);
  }
}

run();
