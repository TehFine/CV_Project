import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  employerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  companyName: string;

  @Prop()
  companyLogo: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  salary: string;

  @Prop()
  salaryMin: number;

  @Prop()
  salaryMax: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  level: string;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String] })
  requirements: string[];

  @Prop({ type: [String] })
  benefits: string[];

  @Prop()
  deadline: Date;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  applied: number;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 'active' })
  status: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);

// Index for search
JobSchema.index({ title: 'text', companyName: 'text', description: 'text', tags: 'text' });
