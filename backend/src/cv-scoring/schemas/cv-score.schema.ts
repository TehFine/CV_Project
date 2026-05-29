import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CvScoreDocument = CvScore & Document;

@Schema({ timestamps: true })
export class CvScore {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job', required: false })
  jobId: MongooseSchema.Types.ObjectId;

  @Prop({ required: false })
  cvUrl?: string;

  @Prop({ required: false })
  score?: number;

  @Prop({ type: Object, required: false })
  analysis?: any;

  @Prop({
    required: false,
    enum: ['candidate_self_score', 'employer_match', 'general_analysis'],
  })
  type?: string;

  @Prop({ type: Buffer, required: false })
  pdfBuffer?: Buffer;

  // Additional fields for compatibility
  @Prop({ required: false })
  fileName?: string;

  @Prop({ required: false })
  targetPosition?: string;

  @Prop({ required: false })
  overall?: number;

  @Prop({ required: false })
  grade?: string;

  @Prop({ required: false })
  gradeLabel?: string;

  @Prop({ required: false })
  level_assessment?: string;

  @Prop({ required: false })
  extracted_experience_years?: number;

  @Prop({ required: false })
  project_quality?: string;

  @Prop({ type: [String], default: [] })
  recommended_roles?: string[];

  @Prop({ type: Object, default: { advanced: [], familiar: [] } })
  skill_analysis?: {
    advanced: string[];
    familiar: string[];
  };

  @Prop({ type: Object, required: false })
  categories?: any[];

  @Prop({ type: [String], default: [] })
  strengths?: string[];

  @Prop({ type: [String], default: [] })
  improvements?: string[];
}

export const CvScoreSchema = SchemaFactory.createForClass(CvScore);
