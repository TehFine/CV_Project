import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CvScore extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  userId: string; // Có thể null nếu ứng viên chưa đăng nhập

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: false })
  targetPosition: string;

  @Prop({ required: true })
  overall: number;

  @Prop({ required: true })
  grade: string;

  @Prop({ required: true })
  gradeLabel: string;

  @Prop({ required: true })
  level_assessment: string;

  @Prop({ required: true })
  extracted_experience_years: number;

  @Prop({ required: true })
  project_quality: string;

  @Prop({ type: [String], default: [] })
  recommended_roles: string[];

  @Prop({ type: Object, default: { advanced: [], familiar: [] } })
  skill_analysis: {
    advanced: string[];
    familiar: string[];
  };

  @Prop({ type: Object, required: true })
  categories: any[];

  @Prop({ type: [String], default: [] })
  strengths: string[];

  @Prop({ type: [String], default: [] })
  improvements: string[];
}

export const CvScoreSchema = SchemaFactory.createForClass(CvScore);
