import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ timestamps: true })
export class Settings {
  @Prop({ required: true, unique: true, default: 'global' })
  key: string;

  @Prop({
    type: Object,
    default: {
      siteName: 'NexCV',
      siteUrl: 'https://nexcv.vn',
      contactEmail: 'support@nexcv.vn',
      contactPhone: '0901234567',
      maintenanceMode: false,
    },
  })
  site: {
    siteName: string;
    siteUrl: string;
    contactEmail: string;
    contactPhone: string;
    maintenanceMode: boolean;
  };

  @Prop({
    type: Object,
    default: {
      cvScoreEnabled: true,
      maxFileSizeMB: 10,
      supportedFormats: ['pdf', 'doc', 'docx'],
      processingTimeoutSec: 60,
      dailyScoreLimit: 5,
    },
  })
  ai: {
    cvScoreEnabled: boolean;
    maxFileSizeMB: number;
    supportedFormats: string[];
    processingTimeoutSec: number;
    dailyScoreLimit: number;
  };

  @Prop({
    type: Object,
    default: {
      requireApproval: true,
      maxJobsPerEmployer: 20,
      featuredJobPrice: 0,
      jobExpiryDays: 90,
      autoCloseExpired: true,
    },
  })
  jobs: {
    requireApproval: boolean;
    maxJobsPerEmployer: number;
    featuredJobPrice: number;
    jobExpiryDays: number;
    autoCloseExpired: boolean;
  };

  @Prop({
    type: Object,
    default: {
      emailVerificationRequired: false,
      employerVerificationRequired: true,
      maxSavedJobs: 50,
    },
  })
  users: {
    emailVerificationRequired: boolean;
    employerVerificationRequired: boolean;
    maxSavedJobs: number;
  };

  @Prop({
    type: Object,
    default: {
      passwordMinLength: 6,
      maxLoginAttempts: 5,
      sessionTimeoutMin: 60,
      mfaEnabled: false,
      rbacEnabled: false,
      auditLogEnabled: true,
    },
  })
  security: {
    passwordMinLength: number;
    maxLoginAttempts: number;
    sessionTimeoutMin: number;
    mfaEnabled: boolean;
    rbacEnabled: boolean;
    auditLogEnabled: boolean;
  };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);
