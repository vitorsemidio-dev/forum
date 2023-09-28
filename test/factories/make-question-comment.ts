import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { fakerPtBr } from 'test/utils/faker'

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityId,
) {
  const question = QuestionComment.create(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: fakerPtBr.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaQuestionComment(
    override: Partial<QuestionCommentProps> = {},
  ) {
    const data = makeQuestionComment(override)

    await this.prismaService.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(data),
    })

    return data
  }
}
