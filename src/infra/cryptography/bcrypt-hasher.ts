import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { hash } from 'bcrypt'

@Injectable()
export class BCryptHasher implements HashGenerator {
  private HASH_SALT_LENGTH = 8
  async hash(payload: string): Promise<string> {
    return hash(payload, this.HASH_SALT_LENGTH)
  }
}
