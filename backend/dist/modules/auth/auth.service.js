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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const user_entity_1 = require("../users/entities/user.entity");
const redis_service_1 = require("../redis/redis.service");
let AuthService = AuthService_1 = class AuthService {
    userRepository;
    jwtService;
    redisService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userRepository, jwtService, redisService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.redisService = redisService;
    }
    async register(dto) {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = this.userRepository.create({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            role: 'user',
            isVerified: false,
            verificationToken,
        });
        const saved = await this.userRepository.save(user);
        this.logger.log(`User registered. Verification Token: ${verificationToken}`);
        this.logger.log(`Verification URL: /auth/verify-account?token=${verificationToken}`);
        const { password, ...result } = saved;
        return result;
    }
    async verifyAccount(token) {
        const user = await this.userRepository.findOne({ where: { verificationToken: token } });
        if (!user) {
            throw new common_1.NotFoundException('Invalid verification token');
        }
        user.isVerified = true;
        user.verificationToken = null;
        await this.userRepository.save(user);
        return { message: 'Account verified successfully' };
    }
    async login(dto) {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET || 'supersecretjwtkey',
            expiresIn: '15m',
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkey',
            expiresIn: '7d',
        });
        await this.redisService.setRefreshToken(user.id, refreshToken, 604800);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        };
    }
    async refresh(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkey',
            });
            const userId = payload.sub;
            const storedToken = await this.redisService.getRefreshToken(userId);
            if (!storedToken || storedToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token session');
            }
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const newPayload = { sub: user.id, email: user.email, role: user.role };
            const accessToken = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_SECRET || 'supersecretjwtkey',
                expiresIn: '15m',
            });
            const newRefreshToken = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkey',
                expiresIn: '7d',
            });
            await this.redisService.setRefreshToken(user.id, newRefreshToken, 604800);
            return {
                accessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (err) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId, token) {
        await this.redisService.delRefreshToken(userId);
        try {
            const decoded = this.jwtService.decode(token);
            if (decoded && decoded.exp) {
                const now = Math.floor(Date.now() / 1000);
                const ttl = decoded.exp - now;
                if (ttl > 0) {
                    await this.redisService.blacklistToken(token, ttl);
                }
            }
        }
        catch (err) {
        }
        return { message: 'Logged out successfully' };
    }
    async forgotPassword(dto) {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new common_1.NotFoundException('User with this email not found');
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        await this.userRepository.save(user);
        this.logger.log(`Password reset token for ${dto.email}: ${resetToken}`);
        this.logger.log(`Reset password URL: /auth/reset-password?token=${resetToken}`);
        return { message: 'Password reset link simulated in console logs' };
    }
    async resetPassword(dto) {
        const user = await this.userRepository.findOne({ where: { resetPasswordToken: dto.token } });
        if (!user) {
            throw new common_1.NotFoundException('Invalid reset token');
        }
        user.password = await bcrypt.hash(dto.password, 10);
        user.resetPasswordToken = null;
        await this.userRepository.save(user);
        return { message: 'Password reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        redis_service_1.RedisService])
], AuthService);
//# sourceMappingURL=auth.service.js.map