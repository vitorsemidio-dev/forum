import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { Prisma } from '@prisma/client'

export class PrismaAttachmentMapper {
  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      title: attachment.title,
      url: attachment.url,
      id: attachment.id.toString(),
    }
  }
}
