import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() body: { email: string; password: string; name: string }) {
    try {
      return await this.authService.register(body.email, body.password, body.name);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() body: { email: string; password: string }) {
    try {
      return await this.authService.login(body.email, body.password);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for 2FA' })
  async verifyOtp(@Body() body: { userId: number; otp: string }) {
    try {
      return await this.authService.verifyOtp(body.userId, body.otp);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Body() body: { refreshToken: string }) {
    try {
      return await this.authService.refreshToken(body.refreshToken);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
