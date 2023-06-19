import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface QuestionAttachmentProps {
  attachmentId: UniqueEntityId
  questionId: UniqueEntityId
}

interface CreateFromIdsParams {
  attachmentIds: string[]
  questionId: UniqueEntityId
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get attachmentId() {
    return this.props.attachmentId
  }

  get questionId() {
    return this.props.questionId
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
    const questionAttachment = new QuestionAttachment(props, id)
    return questionAttachment
  }

  static createFromIds({ attachmentIds, questionId }: CreateFromIdsParams) {
    const attachments = attachmentIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId,
      })
    })
    return attachments
  }
}
