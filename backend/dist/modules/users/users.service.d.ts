import { AuthService } from '../auth/auth.service';
export declare class UsersService {
    private authService;
    constructor(authService: AuthService);
    getUserProfile(userId: number): {
        id: number;
        email: string;
        name: string;
        role: string;
    };
}
