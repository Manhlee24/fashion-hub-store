import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source.js';
import { User } from '../entities/User.js';
import { sendResetPasswordEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const existing = await userRepository.findOneBy({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: 'customer'
    });
    
    await userRepository.save(user);

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await userRepository.findOneBy({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user is populated by middleware
    const userId = (req as any).user.id;
    const user = await userRepository.findOne({
      where: { id: userId },
      select: ['id', 'email', 'name', 'role']
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      // Return 200 even if user not found for security reasons
      return res.status(200).json({ message: 'Nếu email tồn tại, mã xác nhận đã được gửi.' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 15 minutes from now
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + 15);

    user.reset_token = code;
    user.reset_token_expiry = expiry;
    await userRepository.save(user);

    await sendResetPasswordEmail(email, code);

    res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email của bạn.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await userRepository.findOneBy({ email });
    
    if (!user) {
      return res.status(400).json({ message: 'Email hoặc mã xác nhận không hợp lệ.' });
    }

    if (user.reset_token !== code) {
      return res.status(400).json({ message: 'Mã xác nhận không đúng.' });
    }

    if (!user.reset_token_expiry || new Date() > user.reset_token_expiry) {
      return res.status(400).json({ message: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user
    user.password = hashedPassword;
    user.reset_token = null;
    user.reset_token_expiry = null;
    
    await userRepository.save(user);

    res.status(200).json({ message: 'Khôi phục mật khẩu thành công. Vui lòng đăng nhập lại.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
