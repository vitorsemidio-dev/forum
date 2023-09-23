import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { AuthModule } from '@/infra/auth/auth.module'
import { JwtStrategy } from '@/infra/auth/jwt.strategy'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerQuestionController } from '@/infra/http/controller/answer-question.controller'
import { AuthenticateController } from '@/infra/http/controller/authenticate.controller'
import { CreateAccountController } from '@/infra/http/controller/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controller/create-question.controller'
import { DeleteAnswerController } from '@/infra/http/controller/delete-answer.controller'
import { DeleteQuestionController } from '@/infra/http/controller/delete-question.controller'
import { EditAnswerController } from '@/infra/http/controller/edit-answer.controller'
import { EditQuestionController } from '@/infra/http/controller/edit-question.controller'
import { FetchQuestionAnswersController } from '@/infra/http/controller/fetch-question-answers.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controller/fetch-recent-questions.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [AuthModule, CryptographyModule, DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateQuestionController,
    DeleteQuestionController,
    EditQuestionController,
    FetchRecentQuestionsController,
    AnswerQuestionController,
    DeleteAnswerController,
    EditAnswerController,
    FetchQuestionAnswersController,
  ],
  providers: [
    JwtStrategy,
    CreateQuestionUseCase,
    DeleteQuestionUseCase,
    EditQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AnswerQuestionUseCase,
    DeleteAnswerUseCase,
    EditAnswerUseCase,
    FetchQuestionAnswersUseCase,
  ],
})
export class HttpModule {}
