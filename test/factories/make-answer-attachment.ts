import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerAttachment,
  AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityId,
): AnswerAttachment {
  const answerAttachment = AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override,
    },
    id,
  )

  return answerAttachment
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prismaService: PrismaService) {}

  async makePrismaAnswerAttachment(
    override: Partial<AnswerAttachmentProps> = {},
  ) {
    const data = makeAnswerAttachment(override)
    await this.prismaService.attachment.update({
      where: {
        id: data.attachmentId.toString(),
      },
      data: {
        answerId: data.answerId.toString(),
      },
    })
    return data
  }
}
