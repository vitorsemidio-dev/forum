import { Module } from '@nestjs/common'
import { AuthModule } from './infra/auth/auth.module'
import { CryptographyModule } from './infra/cryptography/cryptography.module'
import { PrismaService } from './infra/database/prisma/prisma.service'
import { EnvModule } from './infra/env/env.module'
import { AuthenticateController } from './infra/http/controller/authenticate.controller'
import { CreateAccountController } from './infra/http/controller/create-account.controller'

@Module({
  imports: [EnvModule, AuthModule, CryptographyModule],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
