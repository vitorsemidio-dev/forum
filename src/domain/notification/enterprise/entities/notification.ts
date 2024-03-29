import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface NotificationProps {
  recipientId: UniqueEntityId
  title: string
  content: string
  readAt?: Date | null
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientId(): UniqueEntityId {
    return this.props.recipientId
  }

  get title(): string {
    return this.props.title
  }

  get content(): string {
    return this.props.content
  }

  get readAt(): Date | undefined | null {
    return this.props.readAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(
    props: Optional<NotificationProps, 'createdAt'>,
    id?: UniqueEntityId,
  ): Notification {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }

  toJson() {
    return {
      id: this.id.toString(),
      recipientId: this.recipientId.toString(),
      title: this.title,
      content: this.content,
      readAt: this.readAt?.toISOString(),
      createdAt: this.createdAt.toISOString(),
    }
  }
}
