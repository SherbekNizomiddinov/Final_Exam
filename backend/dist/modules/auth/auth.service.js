"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.users = [
            {
                id: 1,
                email: 'admin@cyber.com',
                password: bcrypt.hashSync('admin123', 10),
                name: 'Admin User',
                role: 'admin',
            },
        ];
    }
    async register(email, password, name) {
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
    async login(email, password) {
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
    async verifyOtp(userId, otp) {
        const user = this.users.find((u) => u.id === userId);
        if (!user) {
            throw new Error('User not found');
        }
        const accessToken = this.jwtService.sign({ userId: user.id, email: user.email, role: user.role }, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign({ userId: user.id }, { expiresIn: '7d', secret: process.env.REFRESH_SECRET || 'refresh-secret-key' });
        return {
            accessToken,
            refreshToken,
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
        };
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = this.jwtService.verify(refreshToken, {
                secret: process.env.REFRESH_SECRET || 'refresh-secret-key',
            });
            const user = this.users.find((u) => u.id === decoded.userId);
            if (!user) {
                throw new Error('User not found');
            }
            const newAccessToken = this.jwtService.sign({ userId: user.id, email: user.email, role: user.role }, { expiresIn: '15m' });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    getUsers() {
        return this.users;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map