import dayjs from 'dayjs'

import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export interface QuestionProps {
  authorId: UniqueEntityId
  attachments: QuestionAttachmentList
  bestAnswerId?: UniqueEntityId | null
  content: string
  createdAt: Date
  slug: Slug
  updatedAt?: Date | null
  title: string
}

export class Question extends AggregateRoot<QuestionProps> {
  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        attachments: props.attachments ?? new QuestionAttachmentList([]),
        createdAt: props.createdAt || new Date(),
        slug: props.slug ?? Slug.createFromText(props.title),
      },
      id,
    )
    return question
  }

  get authorId() {
    return this.props.authorId
  }

  get attachments() {
    return this.props.attachments
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  toJson() {
    return {
      id: this.id.toString(),
      authorId: this.authorId.toString(),
      title: this.title,
      content: this.content,
      slug: this.slug.value,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      attachments: this.attachments.getItems().map((attachment) => {
        return {
          id: attachment.id.toString(),
          questionId: attachment.questionId.toString(),
        }
      }),
      bestAnswerId: this.bestAnswerId?.toString(),
    }
  }
}
