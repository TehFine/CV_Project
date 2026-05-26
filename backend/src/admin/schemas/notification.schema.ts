import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  userId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: 'info', enum: ['info', 'success', 'warning'] })
  type: string;

  @Prop({ default: false })
  read: boolean;

  @Prop({ required: false })
  jobId?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
