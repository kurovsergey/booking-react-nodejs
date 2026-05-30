import { ConflictException, Injectable, NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('User with this email already exists');
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

  async verifyAccount(token: string) {
    const user = await this.userRepository.findOne({ where: { verificationToken: token } });
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    user.isVerified = true;
    user.verificationToken = null;
    await this.userRepository.save(user);

    return { message: 'Account verified successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
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

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'supersecretrefreshjwtkey',
      });

      const userId = payload.sub;
      const storedToken = await this.redisService.getRefreshToken(userId);

      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token session');
      }

      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('User not found');
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
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, token: string) {
    await this.redisService.delRefreshToken(userId);

    try {
      const decoded: any = this.jwtService.decode(token);
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;
        if (ttl > 0) {
          await this.redisService.blacklistToken(token, ttl);
        }
      }
    } catch (err) {
      // Ignore token decoding error
    }

    return { message: 'Logged out successfully' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    await this.userRepository.save(user);

    this.logger.log(`Password reset token for ${dto.email}: ${resetToken}`);
    this.logger.log(`Reset password URL: /auth/reset-password?token=${resetToken}`);

    return { message: 'Password reset link simulated in console logs' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({ where: { resetPasswordToken: dto.token } });
    if (!user) {
      throw new NotFoundException('Invalid reset token');
    }

    user.password = await bcrypt.hash(dto.password, 10);
    user.resetPasswordToken = null;
    await this.userRepository.save(user);

    return { message: 'Password reset successfully' };
  }
}
