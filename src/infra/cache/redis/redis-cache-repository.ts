import { CacheRepository } from '@/infra/cache/cache-repository'
import { RedisService } from '@/infra/cache/redis/redis.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private redis: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    await this.redis.set(key, value, 'EX', 60 * 15)
  }

  get(key: string): Promise<string | null> {
    return this.redis.get(key)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
