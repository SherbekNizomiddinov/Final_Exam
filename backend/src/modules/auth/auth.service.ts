import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

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

  constructor(private jwtService: JwtService) {}

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
    console.log(`[OTP] ${email}: ${otp}`);

    return {
      userId: user.id,
      email: user.email,
      otp,
      message: 'OTP sent to email',
    };
  }

  async verifyOtp(userId: number, otp: string) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // In production, verify against stored OTP
    const accessToken = this.jwtService.sign(
      { userId: user.id, email: user.email, role: user.role },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d', secret: process.env.REFRESH_SECRET || 'refresh-secret-key' },
    );

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
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
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  getUsers() {
    return this.users;
  }
}
