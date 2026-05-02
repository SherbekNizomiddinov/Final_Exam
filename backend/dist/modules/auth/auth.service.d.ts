import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    private users;
    private otpStore;
    constructor(jwtService: JwtService);
    private sendOtpEmail;
    register(email: string, password: string, name: string): Promise<{
        id: number;
        email: string;
        name: string;
    }>;
    login(email: string, password: string): Promise<{
        userId: number;
        email: string;
        message: string;
    }>;
    verifyOtp(userId: number, otp: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    getUsers(): {
        id: number;
        email: string;
        password: any;
        name: string;
        role: string;
    }[];
}
