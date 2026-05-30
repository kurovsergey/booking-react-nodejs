import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { RedisService } from '../redis/redis.service';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly redisService;
    private readonly logger;
    constructor(userRepository: Repository<User>, jwtService: JwtService, redisService: RedisService);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: string;
        isVerified: boolean;
        verificationToken?: string | null;
        resetPasswordToken?: string | null;
        bookings?: import("../bookings/entities/booking.entity").Booking[];
        createdOffices?: import("../offices/entities/office.entity").Office[];
        createdSeats?: import("../seats/entities/working-seat.entity").WorkingSeat[];
    }>;
    verifyAccount(token: string): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
            isVerified: boolean;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(userId: string, token: string): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
