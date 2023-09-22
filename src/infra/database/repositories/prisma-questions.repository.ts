import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '@/infra/http/presenter/prisma-question.mapper'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({
      data,
    })
  }
  async delete(id: string): Promise<void> {
    await this.prisma.question.delete({
      where: {
        id,
      },
    })
  }
  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    })

    if (!question) {
      return null
    }

    return PrismaQuestionMapper.toDomain(question)
  }
  findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.')
  }
  findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.')
  }
  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
