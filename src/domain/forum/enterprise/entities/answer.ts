import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'

export interface AnswerProps {
  content: string
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  attachments: AnswerAttachmentList
  createdAt: Date
  updatedAt?: Date | null
}

export class Answer extends AggregateRoot<AnswerProps> {
  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments || new AnswerAttachmentList([]),
        createdAt: props.createdAt || new Date(),
      },
      id,
    )
    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }

  get attachments() {
    return this.props.attachments
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  toJson() {
    return {
      id: this.id.toString(),
      content: this.content,
      authorId: this.authorId.toString(),
      questionId: this.questionId.toString(),
      attachments: this.attachments
        .getItems()
        .map((attachment) => attachment.toJson()),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    }
  }
}
