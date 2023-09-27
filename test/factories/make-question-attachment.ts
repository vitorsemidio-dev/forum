import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/forum/enterprise/entities/question-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityId,
): QuestionAttachment {
  const questionAttachment = QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return questionAttachment
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaQuestionAttachment(
    override: Partial<QuestionAttachmentProps> = {},
  ) {
    const data = makeQuestionAttachment(override)
    await this.prismaService.attachment.update({
      where: {
        id: data.attachmentId.toString(),
      },
      data: {
        questionId: data.questionId.toString(),
      },
    })
    return data
  }
}
