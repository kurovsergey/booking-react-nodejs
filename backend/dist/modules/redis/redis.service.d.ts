import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private client;
    onModuleInit(): void;
    onModuleDestroy(): void;
    set(key: string, value: string, ttlSeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    blacklistToken(token: string, ttlSeconds: number): Promise<void>;
    isTokenBlacklisted(token: string): Promise<boolean>;
    setRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<void>;
    getRefreshToken(userId: string): Promise<string | null>;
    delRefreshToken(userId: string): Promise<void>;
}
