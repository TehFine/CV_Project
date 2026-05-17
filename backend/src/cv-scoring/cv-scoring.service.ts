import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const pdfParse = require('pdf-parse');
import { JobDocument } from '../jobs/schemas/job.schema';
import { ROLE_KNOWLEDGE_BASE, ROLE_MAPPING } from './constants/knowledge-base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CvScore, CvScoreDocument } from './schemas/cv-score.schema';
import { ApplicationDocument } from '../jobs/schemas/application.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CvScoringService {
  private readonly logger = new Logger(CvScoringService.name);
  private geminiApiKey: string | null = null;
  private readonly GEMINI_MODEL = 'gemini-2.5-flash';
  private readonly GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models`;

  constructor(
    private configService: ConfigService,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
    @InjectModel('Application') private applicationModel: Model<ApplicationDocument>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.geminiApiKey = apiKey;
      this.logger.log('Gemini AI configured successfully.');
    } else {
      this.logger.warn('GEMINI_API_KEY is not configured. AI fallback will not work.');
    }
  }

  async findScoreById(id: string): Promise<CvScoreDocument | null> {
    try {
      return await this.cvScoreModel.findById(id).exec();
    } catch {
      return null;
    }
  }

  async findScoreByCvUrl(cvUrl: string): Promise<CvScoreDocument | null> {
    try {
      return await this.cvScoreModel.findOne({ cvUrl }).sort({ createdAt: -1 }).exec();
    } catch {
      return null;
    }
  }

  private async callGemini(prompt: string): Promise<string | null> {
    if (!this.geminiApiKey) return null;
    const url = `${this.GEMINI_API_URL}/${this.GEMINI_MODEL}:generateContent?key=${this.geminiApiKey}`;
    try {
      const response = await fetch(url, {
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
      if (!response.ok) {
        const errBody = await response.text();
        this.logger.error(`Gemini API error ${response.status}: ${errBody}`);
        return null;
      }
      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
    } catch (err) {
      this.logger.error('Failed to call Gemini API', err);
      return null;
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

  async saveScore(userId: string, result: any, type: string, jobId?: string, cvUrl?: string, pdfBuffer?: Buffer): Promise<CvScoreDocument> {
    const newScore = new this.cvScoreModel({
      userId,
      jobId,
      cvUrl: cvUrl || 'default_cv',
      score: result.overall || result.score || 0,
      analysis: result,
      type,
      pdfBuffer
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

        // Make sure it is linked to the Application
        await this.applicationModel.updateOne(
          { jobId: (job as any)._id as any, candidateId: candidateId as any },
          { aiScoreId: existing._id }
        );

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
    if (this.geminiApiKey) {
      const prompt = `
Bạn là một chuyên gia tuyển dụng nhân sự. Hãy đánh giá CV của ứng viên so với yêu cầu công việc.

Mô tả công việc: ${job.description || 'N/A'}
Nội dung CV: ${cvText}

Trả về JSON theo cấu trúc sau:
{
  "score": (số từ 1-10),
  "review": "đoạn văn tiếng Việt nhận xét ngắn gọn"
}
      `;
      const responseText = await this.callGemini(prompt);
      if (responseText) {
        try {
          const cleaned = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
          const parsed = JSON.parse(cleaned);
          const aiScore = parsed.score ? Number(parsed.score) : localScore;
          
          const finalScore = Math.max(1, Math.min(10, Math.round(aiScore)));
          const review = parsed.review || 'Không có nhận xét chi tiết từ AI.';

          if (candidateId) {
            const overall = finalScore * 10;
            const mockAnalysis = {
              overall,
              grade: overall >= 85 ? 'A' : overall >= 75 ? 'B' : overall >= 65 ? 'C' : 'D',
              gradeLabel: overall >= 85 ? 'Tốt' : overall >= 70 ? 'Khá' : 'Trung bình',
              strengths: ['Đáp ứng yêu cầu kỹ năng', 'Có kinh nghiệm tương đương'],
              improvements: [review],
              categories: [
                { key: 'skills_match', label: 'Kỹ năng', score: overall },
                { key: 'experience', label: 'Kinh nghiệm', score: overall },
                { key: 'education', label: 'Học vấn', score: overall },
                { key: 'format', label: 'Trình bày', score: overall },
                { key: 'keywords', label: 'Từ khóa ATS', score: overall }
              ]
            };

            const saved = await this.saveScore(candidateId, mockAnalysis, 'employer_match', (job as any)._id.toString(), 'employer_uploaded.pdf', pdfBuffer);

            await this.applicationModel.updateOne(
              { jobId: (job as any)._id as any, candidateId: candidateId as any },
              { aiScoreId: saved._id, cvId: saved._id.toString() }
            );
          }

          return {
            score: finalScore,
            review
          };
        } catch (parseError) {
          this.logger.error('Failed to parse Gemini JSON response', parseError);
        }
      }
    }

    // Fallback if Gemini is not configured or failed
    const matchPercentage = Math.round((localScore / 10) * 100);
    const fallbackReview = `Đánh giá tự động: CV của ứng viên khớp khoảng ${matchPercentage}% từ khóa yêu cầu của công việc.`;

    if (candidateId) {
      const overall = localScore * 10;
      const mockAnalysis = {
        overall,
        grade: overall >= 85 ? 'A' : overall >= 75 ? 'B' : overall >= 65 ? 'C' : 'D',
        gradeLabel: overall >= 85 ? 'Tốt' : overall >= 70 ? 'Khá' : 'Trung bình',
        strengths: ['Khớp từ khóa tốt'],
        improvements: [fallbackReview],
        categories: [
          { key: 'skills_match', label: 'Kỹ năng', score: overall },
          { key: 'experience', label: 'Kinh nghiệm', score: overall },
          { key: 'education', label: 'Học vấn', score: overall },
          { key: 'format', label: 'Trình bày', score: overall },
          { key: 'keywords', label: 'Từ khóa ATS', score: overall }
        ]
      };

      const saved = await this.saveScore(candidateId, mockAnalysis, 'employer_match', (job as any)._id.toString(), 'employer_uploaded.pdf', pdfBuffer);

      await this.applicationModel.updateOne(
        { jobId: (job as any)._id as any, candidateId: candidateId as any },
        { aiScoreId: saved._id, cvId: saved._id.toString() }
      );
    }

    return {
      score: localScore,
      review: fallbackReview
    };
  }

  async generateEmployerContext(existingAnalysis: any, job: JobDocument): Promise<string> {
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
    const result = await this.callGemini(prompt);
    return result || 'Không thể tạo đánh giá ngữ cảnh. Vui lòng xem xét điểm số gốc của ứng viên.';
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

    if (this.geminiApiKey) {
      const prompt = `
Bạn là một hệ thống ATS chuyên nghiệp. Trước tiên, hãy kiểm tra xem nội dung văn bản dưới đây có THỰC SỰ là một bản Sơ yếu lý lịch (CV/Resume) hay không.
Nếu nội dung là rác, spam, sách, báo, bài viết ngẫu nhiên, hoặc tài liệu không liên quan đến xin việc:
- Hãy trả về JSON có trường "isValidCv": false, "spamReason": "Lý do ngắn gọn". Không cần chấm điểm các trường khác.

Nếu nội dung là CV/Resume hợp lệ, hãy phân tích mức độ phù hợp của CV đó.
Vị trí: ${jobContext ? jobContext.title : targetPosition}
${jobContext ? `Mô tả công việc (JD): ${jobContext.description}` : ''}
${jobContext && jobContext.requirements && jobContext.requirements.length > 0 ? `Yêu cầu công việc:\n- ${jobContext.requirements.join('\n- ')}` : ''}
${jobContext && jobContext.tags && jobContext.tags.length > 0 ? `Từ khóa/Kỹ năng yêu cầu: ${jobContext.tags.join(', ')}` : ''}

Nội dung CV ứng viên:
${cvText}

Hãy trả về JSON theo định dạng sau:
{
  "isValidCv": true/false,
  "spamReason": "Lý do nếu không phải CV (có thể rỗng)",
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
}
      `;
      const responseText = await this.callGemini(prompt);
      if (responseText) {
        try {
          const cleaned = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
          const parsed = JSON.parse(cleaned);

          if (parsed.isValidCv === false) {
            throw new Error(`SPAM_CV:${parsed.spamReason || 'Tài liệu tải lên không giống một bản CV hợp lệ. Vui lòng kiểm tra lại.'}`);
          }

          const finalResult = {
            id: 'cv_score_' + Date.now(),
            fileName,
            scoredAt: new Date().toISOString(),
            ...parsed
          };
          if (userId) {
            const savedScore = await this.saveScore(
              userId,
              finalResult,
              jobContext ? 'candidate_self_score' : 'general_analysis',
              jobContext ? (jobContext as any)._id.toString() : undefined,
              fileName,
              pdfBuffer
            );
            finalResult.id = savedScore._id.toString();
          }
          return finalResult;
        } catch (parseError) {
          if (parseError.message && parseError.message.startsWith('SPAM_CV:')) {
            throw new Error(parseError.message.replace('SPAM_CV:', ''));
          }
          this.logger.error('Failed to parse Gemini candidate JSON response', parseError);
        }
      }
    }

    // Fallback: Local Knowledge Base Analysis if AI fails
    const fallbackResult = this.evaluateCandidateLocalScore(cvText, targetPosition, fileName, jobContext);
    if (userId) {
      const savedScore = await this.saveScore(
        userId,
        fallbackResult,
        jobContext ? 'candidate_self_score' : 'general_analysis',
        jobContext ? (jobContext as any)._id.toString() : undefined,
        fileName,
        pdfBuffer
      );
      fallbackResult.id = savedScore._id.toString();
    }
    return fallbackResult;
  }
}
