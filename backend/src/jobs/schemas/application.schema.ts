import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Job', required: true })
  jobId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  candidateId: MongooseSchema.Types.ObjectId;

  @Prop()
  coverLetter: string;

  @Prop()
  cvId: string; // ID of the CV used (if any)

  @Prop({
    default: 'pending',
    enum: ['pending', 'reviewing', 'interview', 'offered', 'rejected'],
  })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CvScore' })
  aiScoreId: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  isArchivedByEmployer: boolean;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
