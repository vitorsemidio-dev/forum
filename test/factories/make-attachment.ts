import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment.mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { fakerPtBr } from 'test/utils/faker'

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId,
): Attachment {
  const attachment = Attachment.create(
    {
      title: fakerPtBr.lorem.sentence(),
      url: fakerPtBr.internet.url(),
      ...override,
    },
    id,
  )

  return attachment
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data)

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })

    return attachment
  }

  async makeManyPrismaAttachment(
    quantity: number,
    override: Partial<AttachmentProps> = {},
  ): Promise<Attachment[]> {
    const attachments = Array.from({ length: quantity }).map(() =>
      makeAttachment(override),
    )

    await this.prisma.attachment.createMany({
      data: attachments.map((attachment) =>
        PrismaAttachmentMapper.toPrisma(attachment),
      ),
    })

    return attachments
  }
}
