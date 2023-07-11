import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

interface CreateFromIdsParams {
  attachmentIds: string[]
  questionId: UniqueEntityId
}

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  static createFromIds({ attachmentIds, questionId }: CreateFromIdsParams) {
    const attachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId,
      })
    })
    return new QuestionAttachmentList(attachments)
  }

  compareItems(a: QuestionAttachment, b: QuestionAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
