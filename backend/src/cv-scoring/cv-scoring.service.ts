import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
const mammoth = require('mammoth');
import { JobDocument } from '../jobs/schemas/job.schema';
import { CvScore, CvScoreDocument } from './schemas/cv-score.schema';
import { ROLE_MAPPING, analyzeCVLocal, CVAnalysisResult } from './constants/knowledge-base';
import { ApplicationDocument } from '../jobs/schemas/application.schema';
import { AppLogger } from '../common/logger.service';

@Injectable()
export class CvScoringService {
  private readonly logger = AppLogger.forContext(CvScoringService.name);
  private geminiApiKey: string | null = null;
  private readonly GEMINI_MODEL = 'gemini-3.1-flash-lite';
  private readonly GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models`;

  constructor(
    private configService: ConfigService,
    @InjectModel(CvScore.name) private cvScoreModel: Model<CvScoreDocument>,
    @InjectModel('Application') private applicationModel: Model<ApplicationDocument>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.geminiApiKey = apiKey;
      this.logger.success('Gemini AI configured', { action: 'init' });
    } else {
      this.logger.warn('GEMINI_API_KEY không được cấu hình. Sẽ dùng local fallback.', { action: 'init' });
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

  async parsePdf(buffer: Buffer, fileName: string = 'uploaded_cv.pdf'): Promise<string> {
    try {
      const lowerName = fileName.toLowerCase();
      if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
      }

      // Use pdfjs-dist (v5+) for robust PDF text extraction.
      // Dynamic import because pdfjs-dist v5 is ESM-only.
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const uint8Array = new Uint8Array(buffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;

      const pages: string[] = [];
      const Y_TOLERANCE = 5; // tolerance in PDF units for items on the same line

      for (let i = 1; i <= pdfDocument.numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const content = await page.getTextContent();

        // Get text items only (filter out marked content items)
        const textItems = (content.items as any[]).filter(
          (item: any) => item.str !== undefined && item.transform !== undefined
        );

        // Sort by Y-position (descending = top-to-bottom in PDF coords)
        // then X-position (ascending = left-to-right)
        const sortedItems = [...textItems].sort((a: any, b: any) => {
          const yDiff = b.transform[5] - a.transform[5];
          if (Math.abs(yDiff) > Y_TOLERANCE) return yDiff; // different line
          return a.transform[4] - b.transform[4]; // same line, left-to-right
        });

        // Build text with proper line breaks based on Y-position changes
        const lineParts: string[] = [];
        let currentLine: string[] = [];
        let lastY: number | null = null;

        for (const item of sortedItems) {
          const y = item.transform[5];
          const str = item.str || '';

          if (lastY !== null && Math.abs(y - lastY) > Y_TOLERANCE) {
            // Y changed significantly → new line
            lineParts.push(currentLine.join(' ').replace(/\s+/g, ' ').trim());
            currentLine = [];
          }

          currentLine.push(str);
          lastY = y;
        }

        // Don't forget the last line
        if (currentLine.length > 0) {
          lineParts.push(currentLine.join(' ').replace(/\s+/g, ' ').trim());
        }

        const pageText = lineParts.join('\n');

        pages.push(pageText);
      }

      return pages.join('\n\n');
    } catch (error) {
      this.logger.error('Failed to parse document', error);
      throw new Error('Failed to parse document. Ensure it is a valid PDF or Word file.');
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
    // Also create a fuzzy-normalized version for matching
    const cvFuzzy = cvLower.replace(/[-._\s]+/g, '');

    let matches = 0;

    for (const keyword of allKeywords) {
      const kw = keyword.toLowerCase().trim();
      // Exact match
      if (cvLower.includes(kw)) {
        matches++;
        continue;
      }
      // Fuzzy match: strip dots/dashes/spaces (only for multi-char keywords)
      const kwFuzzy = kw.replace(/[-._\s]+/g, '');
      if (kwFuzzy.length >= 4 && cvFuzzy.includes(kwFuzzy)) {
        matches++;
      }
    }

    const ratio = matches / allKeywords.length;

    // Use exponential curve so matching ~30% of keywords → ~78% of max score
    // matching ~15% of keywords → ~53% of max score (still decent)
    const effectiveRatio = 1 - Math.exp(-5 * ratio);
    // effectiveRatio is 0..1, scale to 1..10 score
    const rawScore = effectiveRatio * 10;
    return Math.max(1, Math.min(10, Math.round(rawScore)));
  }

  async scoreCV(pdfBuffer: Buffer, job: JobDocument, candidateId?: string): Promise<{ score: number; review: string; reused?: boolean }> {
    const fileName = 'uploaded_cv.pdf'; // Default or from file if available

    // 1. Check for existing score from candidate for this job
    if (candidateId) {
      const existing = await this.findExistingScore(candidateId, (job as any)._id.toString());
      if (existing) {
        this.logger.log('Tái sử dụng điểm số AI có sẵn', { action: 'reuse_score', userId: candidateId, jobTitle: job.title });

        // Generate contextual evaluation based on existing analysis
        const employerReview = await this.generateEmployerContext(existing.analysis, job);

        // Save generated recruiter review back into the score model
        existing.analysis = {
          ...(existing.analysis || {}),
          review: employerReview,
          feedback: employerReview
        };
        existing.markModified('analysis');
        existing.type = 'employer_match';
        await existing.save();

        // Make sure it is linked to the Application
        await this.applicationModel.updateOne(
          { jobId: (job as any)._id as any, candidateId: candidateId as any },
          { aiScoreId: existing._id }
        );

        return {
          score: existing.score || 0,
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
Bạn là một chuyên gia tuyển dụng nhân sự.Hãy đánh giá CV của ứng viên so với yêu cầu công việc.

Mô tả công việc: ${job.description || 'N/A'}
Nội dung CV: ${cvText}

Trả về JSON theo cấu trúc sau:
        {
          "score": (số từ 1 - 10),
          "review": "đoạn văn tiếng Việt nhận xét ngắn gọn"
        }
        `;
      const responseText = await this.callGemini(prompt);
      if (responseText) {
        try {
          const cleaned = responseText.replace(/^```json\s * /i, '').replace(/\s * ```$/i, '');
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
              strengths: ['Đáp ứng tốt yêu cầu kỹ năng công việc', 'Có kinh nghiệm chuyên môn tương đương'],
              improvements: ['Cần rà soát và bổ sung chi tiết theo yêu cầu tuyển dụng'],
              review,
              feedback: review,
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
          this.logger.fail('Parse JSON từ Gemini thất bại', { action: 'score_cv', error: parseError.message });
        }
      }
    }

    // Fallback if Gemini is not configured or failed
    this.logger.warn('Dùng local fallback scoring (không có Gemini)', { action: 'score_cv_fallback' });
    const matchPercentage = Math.round((localScore / 10) * 100);
    const fallbackReview = `Đánh giá tự động: CV của ứng viên khớp khoảng ${matchPercentage}% từ khóa yêu cầu của công việc.`;

    if (candidateId) {
      const overall = localScore * 10;
      const mockAnalysis = {
        overall,
        grade: overall >= 85 ? 'A' : overall >= 75 ? 'B' : overall >= 65 ? 'C' : 'D',
        gradeLabel: overall >= 85 ? 'Tốt' : overall >= 70 ? 'Khá' : 'Trung bình',
        strengths: ['Khớp từ khóa tốt'],
        improvements: ['Cần rà soát và bổ sung chi tiết theo yêu cầu tuyển dụng'],
        review: fallbackReview,
        feedback: fallbackReview,
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
Bạn là một chuyên gia tuyển dụng.Dưới đây là kết quả phân tích CV của một ứng viên cho vị trí: ${job.title}.

Dữ liệu phân tích hiện có:
        - Điểm tổng quát: ${existingAnalysis.overall || existingAnalysis.score}/100
          - Điểm mạnh: ${existingAnalysis.strengths?.join(', ') || 'Không có dữ liệu'}
        - Cần cải thiện: ${existingAnalysis.improvements?.join(', ') || 'Không có dữ liệu'}
        - Nhận xét chi tiết: ${existingAnalysis.categories?.map(c => c.feedback).join('; ') || 'Không có dữ liệu'}

Hãy viết một bản đánh giá ngắn gọn(khoảng 3 - 4 câu, tiếng Việt) dành riêng cho Nhà tuyển dụng. 
Tập trung vào việc: Tại sao ứng viên này phù hợp(hoặc không phù hợp) với vị trí này và điều gì nhà tuyển dụng nên lưu ý khi phỏng vấn.

Hãy trả về JSON theo định dạng chính xác sau:
        {
          "evaluation": "nội dung đánh giá cụ thể"
        }
        `;
    const result = await this.callGemini(prompt);
    if (result) {
      try {
        const cleaned = result.replace(/^```json\s * /i, '').replace(/\s * ```$/i, '');
        const parsed = JSON.parse(cleaned);
        return parsed.evaluation || parsed.review || parsed.text || cleaned;
      } catch (err) {
        this.logger.error('Failed to parse employer context JSON', err);
        return result;
      }
    }
    return 'Không thể tạo đánh giá ngữ cảnh. Vui lòng xem xét điểm số gốc của ứng viên.';
  }

  private evaluateCandidateLocalScore(cvText: string, targetPosition: string, fileName: string, jobContext?: JobDocument) {
    // Use the advanced fallback engine from knowledge-base.ts
    // Try to extract a valid role key from the target position string
    const posLower = targetPosition.toLowerCase();
    let targetRole: string | undefined;
    for (const [key] of Object.entries(ROLE_MAPPING)) {
      if (posLower.includes(key)) {
        targetRole = key;
        break;
      }
    }

    const analysisResult = analyzeCVLocal(cvText, targetRole || targetPosition);

    // If jobContext is provided, augment the skills analysis with job-specific requirements/tags
    if (jobContext && (jobContext.requirements?.length || jobContext.tags?.length)) {
      const jobKeywords = [...(jobContext.requirements || []), ...(jobContext.tags || [])]
        .filter(k => k && k.trim() !== '');
      const textLower = cvText.toLowerCase();
      let jobMatches = 0;
      for (const kw of jobKeywords) {
        if (textLower.includes(kw.toLowerCase())) jobMatches++;
      }
      const jobMatchRatio = jobKeywords.length > 0 ? jobMatches / jobKeywords.length : 0.5;

      // Blend the knowledge-base skills score with job-specific match (weighted 70% KB, 30% job-specific)
      const kbSkillsScore = analysisResult.breakdown.skills.score;
      const jobSkillsScore = Math.round(jobMatchRatio * analysisResult.breakdown.skills.maxScore);
      const blendedSkillsScore = Math.round(kbSkillsScore * 0.7 + jobSkillsScore * 0.3);
      analysisResult.breakdown.skills.score = Math.min(blendedSkillsScore, analysisResult.breakdown.skills.maxScore);

      // Recalculate overall score since skills weight changed
      const rawTotal =
        analysisResult.breakdown.skills.score +
        analysisResult.breakdown.experience.score +
        analysisResult.breakdown.education.score +
        analysisResult.breakdown.certifications.score +
        analysisResult.breakdown.softSkills.score +
        analysisResult.breakdown.presentation.score;
      analysisResult.overallScore = Math.min(Math.max(Math.round(rawTotal), 0), 100);

      // Recalculate grade to match the adjusted overall score
      const g = analysisResult.overallScore;
      if (g >= 90) analysisResult.grade = 'A+';
      else if (g >= 80) analysisResult.grade = 'A';
      else if (g >= 70) analysisResult.grade = 'B+';
      else if (g >= 60) analysisResult.grade = 'B';
      else if (g >= 50) analysisResult.grade = 'C+';
      else if (g >= 40) analysisResult.grade = 'C';
      else analysisResult.grade = 'D';
    }

    // Transform CVAnalysisResult to the legacy format expected by the frontend
    return this.transformAnalysisResult(analysisResult, fileName, targetPosition);
  }

  /**
   * Transform CVAnalysisResult (from analyzeCVLocal) into the format
   * expected by the frontend (with categories, icons, etc.)
   */
  private transformAnalysisResult(
    result: CVAnalysisResult,
    fileName: string,
    targetPosition: string
  ): any {
    const { overallScore, grade, breakdown, strengths, improvements } = result;

    // Grade label mapping
    const gradeLabelMap: Record<string, string> = {
      'A+': 'Xuất sắc', 'A': 'Xuất sắc', 'B+': 'Tốt', 'B': 'Tốt',
      'C+': 'Khá', 'C': 'Khá', 'D': 'Cần cải thiện'
    };

    // Simplify grade: A+ → A, B+ → B, C+ → C (frontend uses simple grades)
    const simpleGrade = (grade || 'D').replace('+', '');

    // Build 5 categories from the advanced breakdown
    const categories = [
      {
        key: 'skills_match',
        label: 'Kỹ năng phù hợp',
        score: breakdown.skills?.score ?? 50,
        icon: '🎯',
        feedback: (breakdown.skills?.matchedKeywords?.length ?? 0) > 0
          ? `Đáp ứng ${breakdown.skills.matchedKeywords.length} kỹ năng phù hợp`
          : (breakdown.skills?.missingKeywords?.length ?? 0) > 0
            ? `Thiếu kỹ năng quan trọng: ${breakdown.skills.missingKeywords.slice(0, 4).join(', ')}`
            : 'Cần bổ sung thêm kỹ năng chuyên môn',
        suggestions: (breakdown.skills?.missingKeywords?.length ?? 0) > 0
          ? breakdown.skills.missingKeywords.slice(0, 3).map(k => `Bổ sung: ${k}`)
          : ['Duy trì cập nhật kỹ năng mới']
      },
      {
        key: 'experience',
        label: 'Kinh nghiệm làm việc',
        score: breakdown.experience?.score ?? 50,
        icon: '💼',
        feedback: breakdown.experience?.details?.length > 0
          ? breakdown.experience.details.join('. ')
          : 'Kinh nghiệm cần được mô tả chi tiết hơn',
        suggestions: ['Thêm kết quả đạt được (số liệu cụ thể)', 'Mô tả rõ vai trò trong từng dự án']
      },
      {
        key: 'education',
        label: 'Học vấn & Chứng chỉ',
        score: Math.min(100, (breakdown.education?.score ?? 0) + ((breakdown.certifications?.found?.length ?? 0) > 0 ? 15 : 0)),
        icon: '🎓',
        feedback: breakdown.education?.detected && breakdown.education.detected !== 'Không phát hiện'
          ? `Phát hiện: ${breakdown.education.detected}${(breakdown.certifications?.found?.length ?? 0) > 0 ? '. Chứng chỉ: ' + breakdown.certifications.found.join(', ') : ''}`
          : 'Thiếu thông tin học vấn',
        suggestions: (breakdown.certifications?.found?.length ?? 0) === 0
          ? ['Cân nhắc lấy chứng chỉ chuyên ngành (AWS, GCP, PMP...)']
          : ['Duy trì và cập nhật chứng chỉ']
      },
      {
        key: 'format',
        label: 'Định dạng & Trình bày',
        score: breakdown.presentation?.score ?? 50,
        icon: '📄',
        feedback: (breakdown.presentation?.sectionsFound?.length ?? 0) > 0
          ? `Phát hiện các phần: ${breakdown.presentation.sectionsFound.join(', ')}`
          : 'Bố cục chưa rõ ràng',
        suggestions: (breakdown.presentation?.sectionsMissing?.length ?? 0) > 0
          ? [`Bổ sung: ${breakdown.presentation.sectionsMissing.join(', ')}`]
          : ['Giữ CV trong 1-2 trang', 'Sử dụng font chuẩn']
      },
      {
        key: 'keywords',
        label: 'Từ khóa & ATS',
        score: Math.min(100, Math.round(((breakdown.skills?.score ?? 0) + (breakdown.presentation?.score ?? 0)) / 2)),
        icon: '🔍',
        feedback: (breakdown.skills?.matchedKeywords?.length ?? 0) > 0
          ? `CV chứa ${breakdown.skills.matchedKeywords.length} từ khóa phù hợp`
          : 'CV thiếu nhiều từ khóa quan trọng',
        suggestions: ['Sử dụng từ khóa đúng như JD yêu cầu', 'Bổ sung thuật ngữ ngành phổ biến']
      }
    ];

    return {
      id: 'cv_score_' + Date.now(),
      fileName,
      scoredAt: new Date().toISOString(),
      overall: overallScore ?? 50,
      grade: simpleGrade,
      gradeLabel: gradeLabelMap[grade] || 'N/A',
      categories,
      strengths: strengths ?? [],
      improvements: improvements ?? []
    };
  }

  async scoreCandidateCV(pdfBuffer: Buffer, fileName: string, targetPosition: string = 'Vị trí ứng tuyển chung', jobContext?: JobDocument, userId?: string): Promise<any> {
    // 1. Check for existing score if userId and jobId are present
    if (userId && jobContext) {
      const existing = await this.findExistingScore(userId, (jobContext as any)._id.toString(), fileName);
      if (existing) {
        this.logger.log('Tái sử dụng điểm số có sẵn cho ứng viên', { action: 'reuse_candidate_score', userId, jobTitle: jobContext.title });
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
          this.logger.fail('Parse Gemini response thất bại (candidate)', { action: 'score_candidate_cv', error: parseError.message });
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

  async getCandidatePdfBuffer(jobId: string, candidateId: string): Promise<Buffer | null> {
    try {
      const app = await this.applicationModel.findOne({
        jobId: jobId as any,
        candidateId: candidateId as any
      }).exec();

      if (app) {
        // 1. Try finding by cvId as ObjectId
        try {
          const score = await this.cvScoreModel.findById(app.cvId).exec();
          if (score && score.pdfBuffer) return score.pdfBuffer;
        } catch { }

        // 2. Try by cvUrl string matching app.cvId
        const scoreByUrl = await this.cvScoreModel.findOne({ cvUrl: app.cvId }).sort({ createdAt: -1 }).exec();
        if (scoreByUrl && scoreByUrl.pdfBuffer) return scoreByUrl.pdfBuffer;

        // 3. Try latest general score of this user
        const latestScore = await this.cvScoreModel.findOne({ userId: candidateId as any }).sort({ createdAt: -1 }).exec();
        if (latestScore && latestScore.pdfBuffer) return latestScore.pdfBuffer;
      }
      return null;
    } catch {
      return null;
    }
  }

  async checkCvAccessPermission(score: CvScoreDocument, user: any): Promise<boolean> {
    if (!user) return false;
    const userId = (user._id || user.id)?.toString();
    const userRole = user.role;

    // 1. Admin has absolute access
    if (userRole === 'admin') {
      return true;
    }

    // 2. Candidate who owns this CV has access
    if (score.userId && score.userId.toString() === userId) {
      return true;
    }

    // 3. Employer has access ONLY if the candidate applied to one of their jobs with this CV
    if (userRole === 'employer') {
      // Find all applications submitted by this CV's owner
      // where the CV matches this score's ID or URL
      const applications = await this.applicationModel
        .find({
          candidateId: score.userId,
          $or: [
            { aiScoreId: score._id },
            { cvId: score.cvUrl },
            { cvId: score._id.toString() },
          ],
        } as any)
        .populate('jobId')
        .exec();

      for (const app of applications) {
        const job = app.jobId as any;
        // Check if the job was posted by this employer
        if (job && job.employerId && job.employerId.toString() === userId) {
          return true; // Relationship match found! Access allowed.
        }
      }
    }

    return false;
  }

  async getHistory(userId: string) {
    return this.cvScoreModel.find({ userId: userId as any }).sort({ createdAt: -1 }).exec();
  }

  async getScoreById(id: string): Promise<CvScoreDocument | null> {
    return this.cvScoreModel.findById(id).exec();
  }

  async deleteScoreById(id: string): Promise<boolean> {
    const result = await this.cvScoreModel.findByIdAndDelete(id).exec();
    if (result) {
      this.logger.success('Xóa điểm số CV', { action: 'delete_score', scoreId: id });
    } else {
      this.logger.fail('Xóa điểm số CV thất bại - không tìm thấy', { action: 'delete_score', scoreId: id });
    }
    return !!result;
  }
}

