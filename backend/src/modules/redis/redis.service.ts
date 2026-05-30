import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  // Blacklist logged-out or invalidated access tokens
  async blacklistToken(token: string, ttlSeconds: number): Promise<void> {
    await this.set(`blacklist:${token}`, '1', ttlSeconds);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const res = await this.get(`blacklist:${token}`);
    return res !== null;
  }

  // Store/verify active refresh tokens
  async setRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<void> {
    await this.set(`refresh_token:${userId}`, token, ttlSeconds);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.get(`refresh_token:${userId}`);
  }

  async delRefreshToken(userId: string): Promise<void> {
    await this.del(`refresh_token:${userId}`);
  }
}
