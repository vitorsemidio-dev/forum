import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachment-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-attachments.repository'
import { PrismaAnswersRepository } from '@/infra/database/prisma/repositories/prisma-answers.repository'
import { PrismaAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-attachments.repository'
import { PrismaQuestionAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-question-attachments.repository'
import { PrismaQuestionCommentsRepository } from '@/infra/database/prisma/repositories/prisma-question-comments.repository'
import { PrismaQuestionsRepository } from '@/infra/database/prisma/repositories/prisma-questions.repository'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  providers: [
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: AnswerAttachmentsRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    PrismaService,
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: QuestionCommentsRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
  ],
  exports: [
    AttachmentsRepository,
    AnswerAttachmentsRepository,
    AnswersRepository,
    PrismaService,
    QuestionAttachmentsRepository,
    QuestionsRepository,
    QuestionCommentsRepository,
  ],
})
export class DatabaseModule {}
