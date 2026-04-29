import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['candidate', 'employer'], default: 'candidate' })
  role: string;

  // General fields
  @Prop()
  avatar: string;

  @Prop()
  phone: string;

  @Prop()
  location: string;

  // Candidate specific
  @Prop()
  title: string;

  @Prop()
  bio: string;

  @Prop({ type: [String] })
  skills: string[];

  // Employer specific
  @Prop()
  companyName: string;

  @Prop()
  companyWebsite: string;

  @Prop()
  industry: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
