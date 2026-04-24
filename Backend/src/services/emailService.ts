import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendResetPasswordEmail = async (to: string, code: string) => {
  // If SMTP is not fully configured, just log it for debugging
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n=============================================');
    console.log(`[DEV MODE] Password Reset Code for ${to}: ${code}`);
    console.log('=============================================\n');
    return;
  }

  const mailOptions = {
    from: `"Fashion Hub Store" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Mã xác nhận khôi phục mật khẩu - Fashion Hub Store',
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="text-align: center; color: #000; text-transform: uppercase;">Fashion Hub Store</h2>
        <p>Xin chào,</p>
        <p>Bạn đã yêu cầu khôi phục mật khẩu. Dưới đây là mã xác nhận của bạn:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px 20px; background: #f4f4f5; border-radius: 8px;">${code}</span>
        </div>
        <p>Mã này có hiệu lực trong vòng <strong>15 phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, bạn có thể bỏ qua email này một cách an toàn.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">© 2026 Fashion Hub Store. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Không thể gửi email. Vui lòng thử lại sau.');
  }
};

export const sendContactEmail = async (name: string, email: string, subject: string, message: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n=============================================');
    console.log(`[DEV MODE] CONTACT FORM SUBMISSION`);
    console.log(`From: ${name} (${email})`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    console.log('=============================================\n');
    return;
  }

  const mailOptions = {
    from: `"Fashion Hub Contact" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // Send to the admin's email
    replyTo: email,
    subject: `[Liên hệ mới] ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #000; text-transform: uppercase;">LIÊN HỆ TỪ KHÁCH HÀNG</h2>
        <p><strong>Họ tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Chủ đề:</strong> ${subject}</p>
        <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 12px; color: #666; text-align: center;">Fashion Hub Store System</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Không thể gửi tin nhắn. Vui lòng thử lại sau.');
  }
};
