import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { fakerPtBr } from 'test/utils/faker'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityId,
) {
  const answer = AnswerComment.create(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: fakerPtBr.lorem.text(),
      ...override,
    },
    id,
  )

  return answer
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswerComment(override: Partial<AnswerCommentProps> = {}) {
    const data = makeAnswerComment(override)

    await this.prismaService.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(data),
    })

    return data
  }

  async makeManyPrismaAnswerComment(
    quantity: number,
    override: Partial<AnswerCommentProps> = {},
  ) {
    const comments = Array.from({ length: quantity }).map(() =>
      makeAnswerComment(override),
    )

    await this.prismaService.comment.createMany({
      data: comments.map(PrismaAnswerCommentMapper.toPrisma),
    })

    return comments
  }
}
