import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['candidate', 'employer', 'admin'], default: 'candidate' })
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

  // Saved jobs (candidate bookmarks)
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Job' }], default: [] })
  savedJobs: Types.ObjectId[];

  // Employer specific
  @Prop()
  companyName: string;

  @Prop()
  companyWebsite: string;

  @Prop()
  industry: string;

  // Password reset fields
  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordExpires?: Date;

  // User status (for admin management)
  @Prop({ default: 'active', enum: ['active', 'banned', 'pending', 'inactive'] })
  status?: string;

  // Verification fields
  @Prop({ default: true })
  emailVerified?: boolean;

  @Prop({ default: false })
  verified?: boolean; // employer verification (business license)

  @Prop({ type: [String], default: [] })
  businessDocuments?: string[];

  // CV Builder saved data
  @Prop({ type: Object, default: null })
  cvBuilderData?: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);
