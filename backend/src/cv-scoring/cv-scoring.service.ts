import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const pdfParse = require('pdf-parse');
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JobDocument } from '../jobs/schemas/job.schema';
import { ROLE_KNOWLEDGE_BASE, ROLE_MAPPING } from './constants/knowledge-base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CvScore, CvScoreDocument } from './schemas/cv-score.schema';

@Injectable()
export class CvScoringService {
  private readonly logger = new Logger(CvScoringService.name);
  private genAI: GoogleGenerativeAI | null = null;

  constructor(
    private configService: ConfigService,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY is not configured. AI fallback will not work.');
    }
  }

  async parsePdf(buffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      this.logger.error('Failed to parse PDF', error);
      throw new Error('Failed to parse PDF file. Ensure it is a valid PDF.');
    }
  }

  async findExistingScore(userId: string, jobId?: string, cvUrl?: string): Promise<CvScoreDocument | null> {
    const query: any = { userId };
    if (jobId) query.jobId = jobId;
    if (cvUrl) query.cvUrl = cvUrl;
    
    // Find the most recent score for this user/job/cv
    return this.cvScoreModel.findOne(query).sort({ createdAt: -1 }).exec();
  }

  async saveScore(userId: string, result: any, type: string, jobId?: string, cvUrl?: string): Promise<CvScoreDocument> {
    const newScore = new this.cvScoreModel({
      userId,
      jobId,
      cvUrl: cvUrl || 'default_cv',
      score: result.overall || result.score || 0,
      analysis: result,
      type
    });
    return newScore.save();
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

  async scoreCV(pdfBuffer: Buffer, job: JobDocument, candidateId?: string): Promise<{ score: number; review: string; reused?: boolean }> {
    const fileName = 'uploaded_cv.pdf'; // Default or from file if available

    // 1. Check for existing score from candidate for this job
    if (candidateId) {
      const existing = await this.findExistingScore(candidateId, (job as any)._id.toString());
      if (existing) {
        this.logger.log(`Employer reusing candidate score for user ${candidateId} and job ${job.title}`);
        
        // Generate contextual evaluation based on existing analysis
        const employerReview = await this.generateEmployerContext(existing.analysis, job);
        
        return {
          score: existing.score,
          review: employerReview,
          reused: true
        };
      }
    }

    const cvText = await this.parsePdf(pdfBuffer);
    
    // Step 1: Local Knowledge Base match
    const localScore = this.scoreByKeywords(cvText, job);
    
    // Step 2: Use Gemini for deep analysis
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
Bạn là một chuyên gia tuyển dụng nhân sự. Hãy đánh giá CV của ứng viên so với yêu cầu công việc.

Mô tả công việc:
${job.description || 'Không có mô tả chi tiết'}

Yêu cầu kỹ năng/Từ khóa:
${[...(job.requirements || []), ...(job.tags || [])].join(', ') || 'Không có yêu cầu cụ thể'}

Nội dung CV ứng viên:
${cvText}

Hãy phân tích mức độ phù hợp của ứng viên.
Chỉ trả về ĐÚNG MỘT object JSON chứa 2 trường:
- "score": Một số nguyên từ 1 đến 10 đánh giá mức độ phù hợp.
- "review": Một đoạn văn ngắn (tiếng Việt) nhận xét điểm mạnh, điểm yếu và lý do cho số điểm trên.

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

  async generateEmployerContext(existingAnalysis: any, job: JobDocument): Promise<string> {
    if (!this.genAI) {
      return 'AI không sẵn sàng để tạo đánh giá ngữ cảnh.';
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = `
Bạn là một chuyên gia tuyển dụng. Dưới đây là kết quả phân tích CV của một ứng viên cho vị trí: ${job.title}.

Dữ liệu phân tích hiện có:
- Điểm tổng quát: ${existingAnalysis.overall || existingAnalysis.score}/100
- Điểm mạnh: ${existingAnalysis.strengths?.join(', ') || 'Không có dữ liệu'}
- Cần cải thiện: ${existingAnalysis.improvements?.join(', ') || 'Không có dữ liệu'}
- Nhận xét chi tiết: ${existingAnalysis.categories?.map(c => c.feedback).join('; ') || 'Không có dữ liệu'}

Hãy viết một bản đánh giá ngắn gọn (khoảng 3-4 câu, tiếng Việt) dành riêng cho Nhà tuyển dụng. 
Tập trung vào việc: Tại sao ứng viên này phù hợp (hoặc không phù hợp) với vị trí này và điều gì nhà tuyển dụng nên lưu ý khi phỏng vấn.

Chỉ trả về đoạn văn bản đánh giá, không kèm tiêu đề hay markdown.
      `;
      
      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      this.logger.error('Failed to generate employer context', error);
      return 'Lỗi khi tạo đánh giá ngữ cảnh cho nhà tuyển dụng.';
    }
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

  async scoreCandidateCV(pdfBuffer: Buffer, fileName: string, targetPosition: string = 'Vị trí ứng tuyển chung', jobContext?: JobDocument, userId?: string): Promise<any> {
    // 1. Check for existing score if userId and jobId are present
    if (userId && jobContext) {
      const existing = await this.findExistingScore(userId, (jobContext as any)._id.toString(), fileName);
      if (existing) {
        this.logger.log(`Reusing existing score for user ${userId} and job ${jobContext.title}`);
        return {
          ...existing.analysis,
          id: existing._id,
          reused: true
        };
      }
    }

    const cvText = await this.parsePdf(pdfBuffer);
    
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
Bạn là một hệ thống ATS và chuyên gia tuyển dụng. Hãy chấm điểm CV của ứng viên sau.
${jobContext ? `
Mục tiêu: Đánh giá độ phù hợp (1:1) với Job Description sau:
- Tên công việc: ${jobContext.title}
- Mô tả: ${jobContext.description}
- Yêu cầu: ${jobContext.requirements?.join(', ')}
` : `
Vị trí ứng tuyển mục tiêu: "${targetPosition}"
`}

CV Content:
${cvText}

Yêu cầu: Đánh giá chi tiết CV này và trả về kết quả định dạng JSON.
Hãy chú trọng vào các tiêu chí: Kỹ năng chuyên môn, Kinh nghiệm (số năm, dự án), Chứng chỉ, Dự án cá nhân, và chuẩn ATS.
Kết quả trả về phải là một JSON object tiếng Việt, không kèm markdown.
        `;
        
        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim()
          .replace(/^```json\s*/i, '')
          .replace(/\s*```$/i, '');
          
        try {
           const parsed = JSON.parse(responseText);
            const finalResult = {
              id: 'cv_score_' + Date.now(),
              fileName,
              scoredAt: new Date().toISOString(),
              ...parsed
            };

            if (userId) {
              await this.saveScore(
                userId, 
                finalResult, 
                jobContext ? 'candidate_self_score' : 'general_analysis',
                jobContext ? (jobContext as any)._id.toString() : undefined,
                fileName
              );
            }

            return finalResult;
         } catch (parseError) {
           this.logger.error('Failed to parse Gemini candidate JSON response', parseError);
        }
      } catch (aiError) {
        this.logger.error('Gemini API request failed in candidate scoring', aiError);
      }
    }
    
    // Fallback: Local Knowledge Base Analysis if AI fails
    return this.evaluateCandidateLocalScore(cvText, targetPosition, fileName, jobContext);
  }
}
