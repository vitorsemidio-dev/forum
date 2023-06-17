import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface QuestionAttachmentProps {
  attachmentId: UniqueEntityId
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
}
