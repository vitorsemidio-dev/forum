import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Module } from '@nestjs/common'
import { BCryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    {
      provide: HashGenerator,
      useClass: BCryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BCryptHasher,
    },
  ],
  exports: [HashGenerator, HashComparer],
})
export class CryptographyModule {}
