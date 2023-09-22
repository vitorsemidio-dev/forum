import { AuthModule } from '@/infra/auth/auth.module'
import { JwtStrategy } from '@/infra/auth/jwt.strategy'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AuthenticateController } from '@/infra/http/controller/authenticate.controller'
import { CreateAccountController } from '@/infra/http/controller/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controller/create-question.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [AuthModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
  ],
  providers: [JwtStrategy, PrismaService],
})
export class HttpModule {}
