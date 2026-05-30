import { ExecutionContext } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
declare const JwtAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly redisService;
    constructor(redisService: RedisService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
export {};
