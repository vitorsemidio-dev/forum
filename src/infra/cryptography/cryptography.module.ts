import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { BCryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { Module } from '@nestjs/common'

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
