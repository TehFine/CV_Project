import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JobDocument } from '../jobs/schemas/job.schema';
import { CvScore } from './schemas/cv-score.schema';
import { ROLE_KNOWLEDGE_BASE, ROLE_MAPPING } from './constants/knowledge-base';

@Injectable()
export class CvScoringService {
  private readonly logger = new Logger(CvScoringService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private configService: ConfigService,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScore>
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY is not configured. AI fallback will not work.');
    }
  }

  async parseDocument(file: Express.Multer.File): Promise<string> {
    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdfParse(file.buffer);
        return data.text;
      } else if (
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
        file.mimetype === 'application/msword' ||
        file.originalname.endsWith('.docx') || 
        file.originalname.endsWith('.doc')
      ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value;
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (error) {
      this.logger.error('Failed to parse document', error);
      throw new Error('Failed to parse document. Ensure it is a valid PDF or Word file.');
    }
  }

  private scoreByKeywords(cvText: string, job: JobDocument): number {
    const requirements = job.requirements || [];
    const tags = job.tags || [];
    const allKeywords = [...new Set([...requirements, ...tags])].filter(k => k && k.trim() !== '');
    
    if (allKeywords.length === 0) return 0; // Cannot score by keywords

    const cvLower = cvText.toLowerCase();
    let matches = 0;

    for (const keyword of allKeywords) {
      if (cvLower.includes(keyword.toLowerCase().trim())) {
        matches++;
      }
    }

    const ratio = matches / allKeywords.length;
    const rawScore = ratio * 10;
    return Math.max(1, Math.min(10, Math.round(rawScore)));
  }

  async scoreCV(file: Express.Multer.File, job: JobDocument): Promise<{ score: number; review: string }> {
    const cvText = await this.parseDocument(file);
    
    // Step 1: Local Knowledge Base match
    const localScore = this.scoreByKeywords(cvText, job);
    
    // Step 2: Use Gemini for deep analysis
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
Bạn là một chuyên gia tuyển dụng nhân sự (Head of Talent Acquisition). Hãy đánh giá mức độ phù hợp của CV ứng viên so với công việc cụ thể sau đây. Yêu cầu đọc hiểu sâu, không chỉ đếm từ khóa mà phải đánh giá thực chất năng lực.

Mô tả công việc:
${job.description || 'Không có mô tả chi tiết'}

Yêu cầu kỹ năng/Từ khóa:
${[...(job.requirements || []), ...(job.tags || [])].join(', ') || 'Không có yêu cầu cụ thể'}

Nội dung CV ứng viên:
${cvText}

Hãy phân tích mức độ phù hợp của ứng viên.
Chỉ trả về ĐÚNG MỘT object JSON chứa 2 trường:
- "score": Một số nguyên từ 1 đến 10 đánh giá độ phù hợp sâu (có tính toán đến kinh nghiệm thực tế, không chỉ là đếm từ khóa).
- "review": Một đoạn văn ngắn (tiếng Việt) nhận xét cụ thể điểm mạnh, điểm yếu, chất lượng dự án ứng viên đã làm và lý do cho số điểm trên.

KHÔNG trả về markdown, KHÔNG có \`\`\`json. CHỈ TRẢ VỀ CHUỖI JSON.
        `;
        
        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim()
          .replace(/^```json\s*/i, '')
          .replace(/\s*```$/i, '');
          
        try {
           const parsed = JSON.parse(responseText);
           const aiScore = parsed.score ? Number(parsed.score) : localScore;
           return {
             score: Math.max(1, Math.min(10, Math.round(aiScore))),
             review: parsed.review || 'Không có nhận xét chi tiết từ AI.'
           };
        } catch (parseError) {
           this.logger.error('Failed to parse Gemini JSON response', parseError);
           // Fallback if parsing fails
           return {
             score: localScore,
             review: responseText
           };
        }
      } catch (aiError) {
        this.logger.error('Gemini API request failed', aiError);
      }
    }
    
    // Fallback if Gemini is not configured or failed
    const matchPercentage = Math.round((localScore / 10) * 100);
    return {
      score: localScore,
      review: `Đánh giá tự động: CV của ứng viên khớp khoảng ${matchPercentage}% từ khóa yêu cầu của công việc.`
    };
  }

  private evaluateCandidateLocalScore(cvText: string, targetPosition: string, fileName: string, jobContext?: JobDocument) {
    const textLower = cvText.toLowerCase();
    
    // 1. Skills & Keywords
    let keywords: string[] = [];
    if (jobContext) {
      keywords = [...(jobContext.requirements || []), ...(jobContext.tags || [])];
    } else {
      const posLower = targetPosition.toLowerCase();
      const rolesToMatch: string[] = [];

      // Find relevant roles based on targetPosition
      Object.keys(ROLE_MAPPING).forEach(key => {
        if (posLower.includes(key)) {
          const mapped = ROLE_MAPPING[key];
          if (Array.isArray(mapped)) rolesToMatch.push(...mapped);
          else rolesToMatch.push(mapped);
        }
      });

      // Remove duplicates and get keywords
      const uniqueRoles = [...new Set(rolesToMatch)];
      uniqueRoles.forEach(role => {
        if (ROLE_KNOWLEDGE_BASE[role]) {
          keywords.push(...ROLE_KNOWLEDGE_BASE[role]);
        }
      });

      // If no roles matched, use general soft skills
      if (keywords.length === 0) {
        keywords = ROLE_KNOWLEDGE_BASE.soft_skills;
      }
      
      // Always include soft skills for better context
      keywords = [...new Set([...keywords, ...ROLE_KNOWLEDGE_BASE.soft_skills])];
    }
    
    const validKeywords = keywords.filter(k => k && k.trim() !== '');
    let matches = 0;
    validKeywords.forEach(k => {
      if (textLower.includes(k.toLowerCase().trim())) matches++;
    });
    // Nếu có quá ít từ khóa hợp lệ thì không phạt điểm quá nặng
    const skillsScore = validKeywords.length > 0 ? Math.round((matches / validKeywords.length) * 100) : 60;
    
    // 2. Experience
    const expKeywords = ['kinh nghiệm', 'experience', 'dự án', 'project', 'tham gia', 'work history', 'working at', 'làm việc tại'];
    let expMatches = 0;
    expKeywords.forEach(k => { if (textLower.includes(k)) expMatches++; });
    
    // Check for specific years of experience if possible
    const yearMatch = textLower.match(/(\d+)\+?\s*(năm|year)/);
    let yearBonus = 0;
    if (yearMatch) {
      const years = parseInt(yearMatch[1]);
      if (years >= 5) yearBonus = 20;
      else if (years >= 2) yearBonus = 10;
    }
    
    const expScore = Math.min(100, (expMatches >= 2 ? (expMatches >= 4 ? 85 : 70) : 45) + yearBonus);

    // 2b. Projects
    const projectKeywords = ['dự án', 'project', 'sản phẩm', 'product', 'github', 'demo', 'link'];
    let projectMatches = 0;
    projectKeywords.forEach(k => { if (textLower.includes(k)) projectMatches++; });
    const projectScore = projectMatches >= 2 ? 90 : 50;

    // 3. Education & Certifications
    const eduKeywords = ['học vấn', 'education', 'đại học', 'university', 'bằng', 'chứng chỉ', 'degree', 'gpa', 'scholarship', 'học bổng'];
    const certKeywords = ['chứng chỉ', 'certificate', 'certified', 'ielts', 'toeic', 'jlpt', 'hsk', 'aws', 'azure', 'google cloud', 'pmp'];
    
    let eduMatches = 0;
    eduKeywords.forEach(k => { if (textLower.includes(k)) eduMatches++; });
    
    let certMatches = 0;
    certKeywords.forEach(k => { if (textLower.includes(k)) certMatches++; });
    
    const eduScore = Math.min(100, (eduMatches >= 2 ? 70 : 40) + (certMatches > 0 ? 20 : 0));

    // 4. Format & Length
    let formatScore = 80;
    if (cvText.length < 500) formatScore = 30;
    else if (cvText.length < 1000) formatScore = 60;
    else if (cvText.length > 5000) formatScore = 70; // Quá dài
    else formatScore = 95;
    
    // Check contact info
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(textLower);
    const hasPhone = /(0[3|5|7|8|9])+([0-9]{8})\b/.test(textLower) || /\+?[0-9]{9,15}/.test(textLower);
    if (!hasEmail) formatScore -= 20;
    if (!hasPhone) formatScore -= 10;

    // 5. Keywords (ATS standard terms)
    const atsScore = Math.max(0, Math.min(100, skillsScore + (formatScore > 80 ? 10 : -10)));

    // Calculate overall (Weighting)
    const overall = Math.round(
      (skillsScore * 0.35) + 
      (expScore * 0.25) + 
      (projectScore * 0.15) + 
      (eduScore * 0.1) + 
      (formatScore * 0.05) + 
      (atsScore * 0.1)
    );
    let grade = 'D'; let gradeLabel = 'Cần cải thiện';
    if (overall >= 85) { grade = 'A'; gradeLabel = 'Xuất sắc'; }
    else if (overall >= 70) { grade = 'B'; gradeLabel = 'Tốt'; }
    else if (overall >= 55) { grade = 'C'; gradeLabel = 'Khá'; }

    // Dynamic strings
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    if (skillsScore >= 70) strengths.push('Kỹ năng khá sát với yêu cầu');
    else improvements.push('Cần bổ sung thêm từ khóa kỹ năng chuyên môn');
    
    if (expScore >= 75) strengths.push('Có mô tả kinh nghiệm làm việc rõ ràng');
    else improvements.push('Phần kinh nghiệm còn sơ sài, nên thêm số liệu cụ thể');
    
    if (formatScore >= 80) strengths.push('Định dạng CV tốt, độ dài phù hợp');
    else improvements.push('CV cần chuẩn hóa lại định dạng và bổ sung thông tin liên hệ');

    if (strengths.length === 0) strengths.push('Bố cục cơ bản');
    if (improvements.length === 0) improvements.push('Nên làm nổi bật hơn các thành tựu cá nhân');

    return {
      id: 'cv_score_' + Date.now(),
      fileName,
      scoredAt: new Date().toISOString(),
      overall,
      grade,
      gradeLabel,
      categories: [
        { key: 'skills_match', label: 'Kỹ năng phù hợp', score: Math.max(0, Math.min(100, skillsScore)), icon: '🎯', feedback: skillsScore >= 70 ? 'Đáp ứng tốt từ khóa yêu cầu' : 'Thiếu nhiều từ khóa quan trọng', suggestions: ['Bổ sung thêm kỹ năng chuyên môn'] },
        { key: 'experience', label: 'Kinh nghiệm làm việc', score: expScore, icon: '💼', feedback: expScore >= 75 ? 'Mô tả kinh nghiệm rõ ràng' : 'Cần trình bày rõ số năm và dự án', suggestions: ['Thêm kết quả đạt được (số liệu)'] },
        { key: 'education', label: 'Học vấn & Chứng chỉ', score: eduScore, icon: '🎓', feedback: eduScore >= 70 ? 'Có đủ thông tin học vấn cơ bản' : 'Thiếu thông tin bằng cấp/trường học', suggestions: ['Liệt kê rõ chuyên ngành và GPA'] },
        { key: 'format', label: 'Định dạng & Trình bày', score: Math.max(0, Math.min(100, formatScore)), icon: '📄', feedback: formatScore >= 80 ? 'Bố cục sạch sẽ, đủ thông tin liên hệ' : 'Bố cục chưa tốt hoặc thiếu thông tin', suggestions: ['Sử dụng font chữ phổ thông', 'Kiểm tra lại email/SĐT'] },
        { key: 'keywords', label: 'Từ khóa & ATS', score: atsScore, icon: '🔍', feedback: atsScore >= 70 ? 'CV có chứa từ khóa chuẩn' : 'Ít từ khóa chuẩn ATS', suggestions: ['Sử dụng từ khóa đúng như JD yêu cầu'] }
      ],
      strengths,
      improvements
    };
  }

  async scoreCandidateCV(file: Express.Multer.File, targetPosition: string = 'Vị trí ứng tuyển chung', jobContext?: JobDocument, user?: any): Promise<any> {
    const cvText = await this.parseDocument(file);
    
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
Bạn là một chuyên gia tuyển dụng cấp cao (Head of Talent Acquisition) và là một hệ thống ATS thông minh.
Nhiệm vụ của bạn là đọc hiểu sâu (contextual analysis) CV của ứng viên, không chỉ đếm từ khóa mà phải phân tích chất lượng kinh nghiệm, mức độ đóng góp trong dự án và mức độ thành thạo kỹ năng.

${jobContext ? `
Mục tiêu: Đánh giá độ phù hợp (1:1) với Job Description sau:
- Tên công việc: ${jobContext.title}
- Mô tả: ${jobContext.description}
- Yêu cầu: ${jobContext.requirements?.join(', ')}
- Kỹ năng (Tags): ${jobContext.tags?.join(', ')}
` : `
Mục tiêu: Đánh giá năng lực tổng quan dựa trên Vị trí ứng tuyển mục tiêu: "${targetPosition}"
`}

Nội dung CV ứng viên:
${cvText}

--- YÊU CẦU TRẢ VỀ ---
Hãy phân tích cực kỳ chi tiết và trả về kết quả định dạng JSON. KHÔNG kèm markdown, KHÔNG kèm \`\`\`json. CHỈ CÓ CHUỖI JSON.
Cấu trúc JSON bắt buộc phải chính xác như sau (dùng tiếng Việt):
{
  "overall": <số nguyên 1-100 đánh giá tổng quan>,
  "grade": "<một trong các ký tự: A, B, C, D>",
  "gradeLabel": "<Đánh giá ngắn gọn: Xuất sắc / Tốt / Khá / Cần cải thiện>",
  "level_assessment": "<Đánh giá level thực tế dựa trên độ phức tạp của công việc đã làm: Intern, Fresher, Junior, Middle, Senior, Lead...>",
  "extracted_experience_years": <số thực, ví dụ 1.5, 3.0, tính tổng thời gian làm việc thực tế>,
  "project_quality": "<Nhận xét về chất lượng dự án: Quy mô, công nghệ sử dụng, vai trò đóng góp của ứng viên có rõ ràng không>",
  "skill_analysis": {
    "advanced": ["<Tên kỹ năng 1>", "<Tên kỹ năng 2>"], // Các kỹ năng có dẫn chứng áp dụng trong dự án/kinh nghiệm
    "familiar": ["<Tên kỹ năng 3>", "<Tên kỹ năng 4>"]  // Các kỹ năng chỉ thấy liệt kê, chưa thấy rõ bối cảnh sử dụng
  },
  "recommended_roles": ["<Tên Vị trí 1>", "<Tên Vị trí 2>", "<Tên Vị trí 3>"], // Phân tích tổng thể năng lực và đề xuất 3 vị trí công việc mà ứng viên sẽ làm tốt nhất hiện tại
  "strengths": ["<Điểm mạnh 1>", "<Điểm mạnh 2>"],
  "improvements": ["<Điểm yếu 1>", "<Điểm yếu 2>"],
  "categories": [
    {
      "key": "skills_match",
      "label": "Kỹ năng thực tế",
      "score": <1-100>,
      "icon": "🎯",
      "feedback": "<Nhận xét: Kỹ năng có đáp ứng yêu cầu công việc/thị trường không>",
      "suggestions": ["<Gợi ý học thêm 1>", "<Gợi ý 2>"]
    },
    {
      "key": "experience",
      "label": "Độ sâu kinh nghiệm",
      "score": <1-100>,
      "icon": "💼",
      "feedback": "<Nhận xét: Kinh nghiệm có thực chất, có số liệu đo lường không>",
      "suggestions": ["<Gợi ý 1>"]
    },
    {
      "key": "education",
      "label": "Học vấn & Chứng chỉ",
      "score": <1-100>,
      "icon": "🎓",
      "feedback": "<Nhận xét>",
      "suggestions": ["<Gợi ý>"]
    },
    {
      "key": "format",
      "label": "Cấu trúc & Trình bày",
      "score": <1-100>,
      "icon": "📄",
      "feedback": "<Nhận xét cấu trúc CV, độ dài, thông tin liên hệ>",
      "suggestions": ["<Gợi ý>"]
    },
    {
      "key": "keywords",
      "label": "Chuẩn ATS",
      "score": <1-100>,
      "icon": "🔍",
      "feedback": "<Nhận xét về độ thân thiện với hệ thống ATS, từ khóa ngành>",
      "suggestions": ["<Gợi ý>"]
    }
  ]
}
`;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim()
          .replace(/^```json\s*/i, '')
          .replace(/\s*```$/i, '');
          
        try {
           const parsedJson = JSON.parse(responseText);
           
           // --- LƯU KẾT QUẢ VÀO DATABASE ---
           const finalScore = {
             userId: user ? user._id : null,
             fileName: file.originalname,
             targetPosition: targetPosition,
             overall: parsedJson.overall,
             grade: parsedJson.grade,
             gradeLabel: parsedJson.gradeLabel,
             level_assessment: parsedJson.level_assessment,
             extracted_experience_years: parsedJson.extracted_experience_years,
             project_quality: parsedJson.project_quality,
             recommended_roles: parsedJson.recommended_roles || [],
             skill_analysis: parsedJson.skill_analysis || { advanced: [], familiar: [] },
             categories: parsedJson.categories || [],
             strengths: parsedJson.strengths || [],
             improvements: parsedJson.improvements || [],
           };
           
           const savedScore = await this.cvScoreModel.create(finalScore);

           return {
             id: savedScore._id,
             fileName: file.originalname,
             scoredAt: (savedScore as any).createdAt,
             ...parsedJson
           };
        } catch (parseError) {
           this.logger.error('Failed to parse Gemini candidate JSON response', parseError);
        }
      } catch (aiError) {
        this.logger.error('Gemini API request failed in candidate scoring', aiError);
      }
    }
    
    // Fallback: Local Knowledge Base Analysis if AI fails
    const fallback = this.evaluateCandidateLocalScore(cvText, targetPosition, file.originalname, jobContext);
    const savedScore = await this.cvScoreModel.create({
      userId: user ? user._id : null,
      targetPosition: targetPosition,
      ...fallback,
      level_assessment: 'Chưa rõ',
      extracted_experience_years: 0,
      project_quality: 'Đánh giá cơ bản',
      skill_analysis: { advanced: [], familiar: [] },
      recommended_roles: []
    });
    return { ...fallback, id: savedScore._id };
  }

  async getHistory(userId: string) {
    return this.cvScoreModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }
}
