import { Module } from '@nestjs/common'
import { CryptographyModule } from './infra/cryptography/cryptography.module'
import { PrismaService } from './infra/database/prisma/prisma.service'
import { EnvModule } from './infra/env/env.module'
import { CreateAccountController } from './infra/http/controller/create-account.controller'

@Module({
  imports: [EnvModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
