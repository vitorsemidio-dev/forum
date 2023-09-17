import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BCryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BCryptHasher,
    },
  ],
  exports: [HashGenerator],
})
export class CryptographyModule {}
