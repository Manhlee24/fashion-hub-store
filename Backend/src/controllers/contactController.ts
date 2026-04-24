import { Request, Response } from 'express';
import { sendContactEmail } from '../services/emailService.js';

export const submitContact = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.' });
  }

  try {
    await sendContactEmail(name, email, subject || 'Không có chủ đề', message);
    res.status(200).json({ message: 'Tin nhắn của bạn đã được gửi thành công.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
