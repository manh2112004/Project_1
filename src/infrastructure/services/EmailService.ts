import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }
  }

  async sendOtpEmail(email: string, otpCode: string): Promise<void> {
    const subject = "Mã xác thực OTP đăng ký tài khoản NEXSTORE";
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; rounded-corner: 10px;">
        <h2 style="color: #6366f1;">XÁC THỰC ĐĂNG KÝ TÀI KHOẢN NEXSTORE</h2>
        <p>Xin chào,</p>
        <p>Mã xác thực OTP đăng ký tài khoản của bạn là:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10b981; padding: 10px 0;">
          ${otpCode}
        </div>
        <p style="color: #94a3b8; font-size: 13px;">Mã OTP có hiệu lực trong vòng <strong>5 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        <hr style="border-color: #334155; margin-top: 20px;" />
        <p style="color: #64748b; font-size: 11px;">Trân trọng,<br/>Đội ngũ Hỗ trợ NEXSTORE</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: `"NEXSTORE Security" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html: htmlContent,
        });
        console.log(`[EmailService] Đã gửi OTP email đến: ${email}`);
      } catch (error) {
        console.error(`[EmailService] Lỗi gửi mail qua SMTP:`, error);
        console.log(`[DEV FALLBACK] MÃ OTP CỦA ${email} LÀ: ${otpCode}`);
      }
    } else {
      console.log(`\n==================================================`);
      console.log(`📧 [DEV EMAIL SIMULATION] Nối mạng SMTP chưa được cấu hình`);
      console.log(`Gửi đến: ${email}`);
      console.log(`MÃ OTP ĐĂNG KÝ LÀ: >>> ${otpCode} <<< (Hiệu lực 5 phút)`);
      console.log(`==================================================\n`);
    }
  }
}
