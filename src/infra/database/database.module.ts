import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './repositories/prisma-questions.repository'

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
  ],
  exports: [PrismaService, QuestionsRepository],
})
export class DatabaseModule {}
