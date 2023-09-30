import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { AuthenticateUseCase } from '@/domain/forum/application/use-cases/authenticate.use-case'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
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
import { CommentOnAnswerController } from '@/infra/http/controller/comment-on-answer.controller'
import { CommentOnQuestionController } from '@/infra/http/controller/comment-on-question.controller'
import { CreateAccountController } from '@/infra/http/controller/create-account.controller'
import { CreateQuestionController } from '@/infra/http/controller/create-question.controller'
import { DeleteAnswerCommentController } from '@/infra/http/controller/delete-answer-comment.controller'
import { DeleteAnswerController } from '@/infra/http/controller/delete-answer.controller'
import { DeleteQuestionCommentController } from '@/infra/http/controller/delete-question-comment.controller'
import { DeleteQuestionController } from '@/infra/http/controller/delete-question.controller'
import { EditAnswerController } from '@/infra/http/controller/edit-answer.controller'
import { EditQuestionController } from '@/infra/http/controller/edit-question.controller'
import { FetchQuestionAnswersController } from '@/infra/http/controller/fetch-question-answers.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controller/fetch-recent-questions.controller'
import { GetQuestionBySlugController } from '@/infra/http/controller/get-question-by-slug.controller'
import { UploadAttachmentController } from '@/infra/http/controller/upload-attachment.controller'
import { StorageModule } from '@/infra/storage/storage.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [AuthModule, CryptographyModule, DatabaseModule, StorageModule],
  controllers: [
    AnswerQuestionController,
    AuthenticateController,
    ChooseQuestionBestAnswerController,
    CommentOnAnswerController,
    CommentOnQuestionController,
    CreateAccountController,
    CreateQuestionController,
    DeleteAnswerCommentController,
    DeleteAnswerController,
    DeleteQuestionController,
    DeleteQuestionCommentController,
    EditAnswerController,
    EditQuestionController,
    FetchQuestionAnswersController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    UploadAttachmentController,
  ],
  providers: [
    AnswerQuestionUseCase,
    AuthenticateUseCase,
    ChooseQuestionBestAnswerUseCase,
    CommentOnAnswerUseCase,
    CommentOnQuestionUseCase,
    CreateQuestionUseCase,
    DeleteAnswerCommentUseCase,
    DeleteAnswerUseCase,
    DeleteQuestionUseCase,
    DeleteQuestionCommentUseCase,
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
