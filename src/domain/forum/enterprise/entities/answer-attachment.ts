import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface AnswerAttachmentProps {
  attachmentId: UniqueEntityId
  answerId: UniqueEntityId
}

interface CreateFromIdsParams {
  attachmentIds: string[]
  answerId: UniqueEntityId
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get attachmentId() {
    return this.props.attachmentId
  }

  get answerId() {
    return this.props.answerId
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityId) {
    const answerAttachment = new AnswerAttachment(props, id)
    return answerAttachment
  }

  static createFromIds({ attachmentIds, answerId }: CreateFromIdsParams) {
    const attachments = attachmentIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId,
      })
    })
    return attachments
  }
}
