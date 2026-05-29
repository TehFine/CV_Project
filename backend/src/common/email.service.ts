import { Injectable, Logger as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AppLogger } from './logger.service';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = AppLogger.forContext(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initTransporter();
  }

  private initTransporter() {
    const host = this.configService.get<string>('SMTP_HOST');
    if (!host) {
      this.logger.warn('SMTP not configured — email sending is disabled');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host,
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: this.configService.get<boolean>('SMTP_SECURE', false),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });

    // Verify SMTP connection on startup
    this.transporter
      .verify()
      .then(() => {
        this.logger.success('Email transporter initialized', {
          host,
          action: 'smtp_init',
        });
      })
      .catch((err) => {
        this.logger.error('SMTP connection verification failed', err, {
          host,
          action: 'smtp_init',
        });
      });
  }

  async sendPasswordResetEmail(
    to: string,
    resetToken: string,
    userName: string,
  ): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Cannot send email — SMTP not configured', {
        email: to,
        action: 'send_reset_email',
      });
      return;
    }

    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
    const safeName = this.escapeHtml(userName);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #F8FAFC; margin: 0; padding: 0; }
          .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
          .card { background: white; border-radius: 16px; padding: 40px 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E2E8F0; }
          .logo { font-size: 24px; font-weight: 900; color: #1549B8; margin-bottom: 24px; text-align: center; }
          .logo span { color: #2563EB; }
          h1 { font-size: 22px; font-weight: 800; color: #0F172A; margin-bottom: 8px; text-align: center; }
          p { font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 24px; text-align: center; }
          .btn-wrap { text-align: center; margin-bottom: 24px; }
          .btn { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1549B8, #1E40AF); color: white !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; }
          .footer { text-align: center; font-size: 12px; color: #94A3B8; margin-top: 32px; }
          .footer a { color: #94A3B8; }
          .expiry { text-align: center; font-size: 13px; color: #94A3B8; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="logo">Nex<span>CV</span></div>
            <h1>Đặt lại mật khẩu</h1>
            <p>Xin chào <strong>${safeName}</strong>,<br>
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại NexCV. 
            Nhấn nút bên dưới để tạo mật khẩu mới.</p>
            <div class="btn-wrap">
              <a href="${resetLink}" class="btn">Đặt lại mật khẩu</a>
            </div>
            <p style="font-size: 14px; color: #64748B;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <div class="expiry">Liên kết có hiệu lực trong <strong>1 giờ</strong></div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} NexCV. Mọi quyền được bảo lưu.</p>
              <p>Nếu nút không hoạt động, hãy sao chép và dán link sau vào trình duyệt:<br>
              <a href="${resetLink}" style="word-break: break-all;">${resetLink}</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `Đặt lại mật khẩu NexCV\n\nXin chào ${safeName},\n\nChúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại NexCV.\n\nVui lòng truy cập link sau để đặt lại mật khẩu:\n${resetLink}\n\nLiên kết có hiệu lực trong 1 giờ.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.`;

    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM', 'noreply@nexcv.vn'),
        to,
        subject: 'NexCV — Đặt lại mật khẩu của bạn',
        text,
        html,
      });
      this.logger.success('Password reset email sent', {
        email: to,
        action: 'send_reset_email',
      });
    } catch (error) {
      this.logger.error('Failed to send password reset email', error, {
        email: to,
        action: 'send_reset_email',
      });
      throw new Error(
        'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.',
      );
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
