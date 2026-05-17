import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CvScoreDocument = CvScore & Document;

@Schema({ timestamps: true })
export class CvScore {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job' })
  jobId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  cvUrl: string;

  @Prop({ required: true })
  score: number;

  @Prop({ type: Object, required: true })
  analysis: any;

  @Prop({ 
    required: true, 
    enum: ['candidate_self_score', 'employer_match', 'general_analysis'] 
  })
  type: string;

  @Prop({ type: Buffer })
  pdfBuffer: Buffer;
}

export const CvScoreSchema = SchemaFactory.createForClass(CvScore);
