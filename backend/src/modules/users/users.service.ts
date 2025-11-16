import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(private authService: AuthService) {}

  getUserProfile(userId: number) {
    const users = this.authService.getUsers();
    const user = users.find((u) => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
