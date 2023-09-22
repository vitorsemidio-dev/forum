import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { AuthModule } from '@/infra/auth/auth.module'
import { JwtStrategy } from '@/infra/auth/jwt.strategy'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AuthenticateController } from '@/infra/http/controller/authenticate.controller'
import { CreateAccountController } from '@/infra/http/controller/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controller/create-question.controller'
import { DeleteQuestionController } from '@/infra/http/controller/delete-question.controller'
import { EditQuestionController } from '@/infra/http/controller/edit-question.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [AuthModule, CryptographyModule, DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    DeleteQuestionController,
    EditQuestionController,
  ],
  providers: [
    JwtStrategy,
    CreateQuestionUseCase,
    DeleteQuestionUseCase,
    EditQuestionUseCase,
  ],
})
export class HttpModule {}
