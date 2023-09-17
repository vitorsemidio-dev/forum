import { Module } from '@nestjs/common'
import { CryptographyModule } from './infra/cryptography/cryptography.module'
import { PrismaService } from './infra/database/prisma/prisma.service'
import { CreateAccountController } from './infra/http/controller/create-account.controller'

@Module({
  imports: [CryptographyModule],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
