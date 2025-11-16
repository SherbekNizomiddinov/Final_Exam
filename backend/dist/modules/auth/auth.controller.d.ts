import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        id: number;
        email: string;
        name: string;
    }>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        userId: number;
        email: string;
        otp: string;
        message: string;
    }>;
    verifyOtp(body: {
        userId: number;
        otp: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
}
