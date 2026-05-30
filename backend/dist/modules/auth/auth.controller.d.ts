import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, RefreshDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(dto: RefreshDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
