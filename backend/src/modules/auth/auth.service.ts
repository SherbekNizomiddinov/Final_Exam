import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private users = [
    {
      id: 1,
      email: 'admin@cyber.com',
      password: bcrypt.hashSync('admin123', 10),
      name: 'Admin User',
      role: 'admin',
    },
  ];

  private otpStore = new Map<number, { otp: string; expiresAt: number }>();

  constructor(private jwtService: JwtService) {}

  private async sendOtpEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Apple Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your login OTP code',
      html: `
        <div style="font-family:Arial;padding:20px">
          <h2>Login verification</h2>
          <p>Your OTP code:</p>
          <h1 style="letter-spacing:4px">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
        </div>
      `,
    });
  }

  async register(email: string, password: string, name: string) {
    if (this.users.find((u) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: this.users.length + 1,
      email,
      password: bcrypt.hashSync(password, 10),
      name,
      role: 'user',
    };

    this.users.push(newUser);
    return { id: newUser.id, email, name };
  }

  async login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid credentials');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    this.otpStore.set(user.id, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await this.sendOtpEmail(user.email, otp);

    return {
      userId: user.id,
      email: user.email,
      message: 'OTP sent to email',
    };
  }

  async verifyOtp(userId: number, otp: string) {
    const user = this.users.find((u) => u.id === Number(userId));

    if (!user) {
      throw new Error('User not found');
    }

    const savedOtp = this.otpStore.get(user.id);

    if (!savedOtp) {
      throw new Error('OTP not found. Please login again');
    }

    if (savedOtp.expiresAt < Date.now()) {
      this.otpStore.delete(user.id);
      throw new Error('OTP expired');
    }

    if (savedOtp.otp !== otp) {
      throw new Error('Invalid OTP');
    }

    this.otpStore.delete(user.id);

    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email, role: user.role },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn: '7d',
        secret: process.env.REFRESH_SECRET || 'refresh-secret-key',
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_SECRET || 'refresh-secret-key',
      });

      const user = this.users.find((u) => u.id === decoded.userId);

      if (!user) {
        throw new Error('User not found');
      }

      const newAccessToken = this.jwtService.sign(
        { userId: user.id, email: user.email, role: user.role },
        { expiresIn: '15m' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  getUsers() {
    return this.users;
  }
}
