import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

interface CreateFromIdsParams {
  attachmentIds: string[]
  answerId: UniqueEntityId
}

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  static createFromIds({ answerId, attachmentIds }: CreateFromIdsParams) {
    const attachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId,
      })
    })
    return new AnswerAttachmentList(attachments)
  }

  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId === b.attachmentId
  }
}
