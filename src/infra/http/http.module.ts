import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { AuthModule } from '@/infra/auth/auth.module'
import { JwtStrategy } from '@/infra/auth/jwt.strategy'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { AnswerQuestionController } from '@/infra/http/controller/answer-question.controller'
import { AuthenticateController } from '@/infra/http/controller/authenticate.controller'
import { ChooseQuestionBestAnswerController } from '@/infra/http/controller/choose-question-best-answer.controller'
import { CreateAccountController } from '@/infra/http/controller/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controller/create-question.controller'
import { DeleteAnswerController } from '@/infra/http/controller/delete-answer.controller'
import { DeleteQuestionController } from '@/infra/http/controller/delete-question.controller'
import { EditAnswerController } from '@/infra/http/controller/edit-answer.controller'
import { EditQuestionController } from '@/infra/http/controller/edit-question.controller'
import { FetchQuestionAnswersController } from '@/infra/http/controller/fetch-question-answers.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controller/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from '@/infra/http/controller/get-question-by-slug.controller'
import { UploadAttachmentController } from '@/infra/http/controller/upload-attachment.controller'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'
import { CommentOnQuestionController } from './controller/comment-on-question.controller'

@Module({
  imports: [AuthModule, CryptographyModule, DatabaseModule, StorageModule],
  controllers: [
    AnswerQuestionController,
    AuthenticateController,
    ChooseQuestionBestAnswerController,
    CommentOnQuestionController,
    CreateAccountController,
    CreateQuestionController,
    DeleteAnswerController,
    DeleteQuestionController,
    EditAnswerController,
    EditQuestionController,
    FetchQuestionAnswersController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    UploadAttachmentController,
  ],
  providers: [
    AnswerQuestionUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnQuestionUseCase,
    CreateQuestionUseCase,
    DeleteAnswerUseCase,
    DeleteQuestionUseCase,
    EditAnswerUseCase,
    EditQuestionUseCase,
    FetchQuestionAnswersUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    JwtStrategy,
    UploadAndCreateAttachmentUseCase,
  ],
})
export class HttpModule {}
