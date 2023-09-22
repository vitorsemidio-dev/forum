import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachment-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionAttachmentsRepository } from '@/infra/database/prisma/repositories/prisma-question-attachments.repository'
import { PrismaQuestionsRepository } from '@/infra/database/prisma/repositories/prisma-questions.repository'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: QuestionAttachmentsRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
  ],
  exports: [PrismaService, QuestionsRepository, QuestionAttachmentsRepository],
})
export class DatabaseModule {}
